import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import sharp from 'sharp';
import { AvatarType } from '../generated/prisma/enums.js';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { BucketService } from '../shared/modules/bucket/index.js';
import {
  PROFILE_UPDATED,
  type ProfileUpdatedEvent,
} from '../shared/events/profile.events.js';

/** Lado máximo (px) de la versión "original" (detalle, no calidad plena). */
const ORIGINAL_MAX = 1280;
/** Lado (px) del thumbnail cuadrado. */
const THUMB_SIZE = 256;

export interface AvatarUrls {
  thumbnail: string | null;
  original: string | null;
}

@Injectable()
export class AvatarsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bucket: BucketService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Prefijo (carpeta) del usuario en el bucket. */
  private prefix(userId: string): string {
    return `avatars/${userId}/`;
  }

  /**
   * Sube/reemplaza la foto de perfil: genera dos webp (original + thumbnail),
   * borra la anterior (si existía) y sube las nuevas con nombres deterministas.
   */
  async upload(userId: string, file?: Express.Multer.File): Promise<AvatarUrls> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('No se envió ninguna imagen');
    }
    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    // Transformaciones (rotate() respeta la orientación EXIF antes de reescalar).
    let originalBuffer: Buffer;
    let thumbnailBuffer: Buffer;
    try {
      [originalBuffer, thumbnailBuffer] = await Promise.all([
        sharp(file.buffer)
          .rotate()
          .resize({
            width: ORIGINAL_MAX,
            height: ORIGINAL_MAX,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer(),
        sharp(file.buffer)
          .rotate()
          .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: 'cover' })
          .webp({ quality: 72 })
          .toBuffer(),
      ]);
    } catch {
      throw new BadRequestException('No se pudo procesar la imagen');
    }

    // Reemplazo: borra cualquier archivo previo del usuario.
    await this.bucket.deleteByPrefix(this.prefix(userId));

    const originalKey = `${this.prefix(userId)}${userId}-original.webp`;
    const thumbnailKey = `${this.prefix(userId)}${userId}-thumbnail.webp`;

    // Se guardan PRIVADOS: solo se ven vía este endpoint (con validación).
    await Promise.all([
      this.bucket.uploadItem(originalKey, originalBuffer, { acl: 'private' }),
      this.bucket.uploadItem(thumbnailKey, thumbnailBuffer, { acl: 'private' }),
    ]);

    // En `url` se guarda la RUTA del endpoint (no la URL pública del bucket): el
    // cliente la usa como `src` y la validación decide si sirve la imagen.
    const originalUrl = this.apiPath(userId, AvatarType.ORIGINAL);
    const thumbnailUrl = this.apiPath(userId, AvatarType.THUMBNAIL);

    // Persiste (upsert) las dos filas del avatar.
    await this.prisma.$transaction([
      this.prisma.userAvatar.upsert({
        where: { userId_type: { userId, type: AvatarType.ORIGINAL } },
        update: { key: originalKey, url: originalUrl },
        create: { userId, type: AvatarType.ORIGINAL, key: originalKey, url: originalUrl },
      }),
      this.prisma.userAvatar.upsert({
        where: { userId_type: { userId, type: AvatarType.THUMBNAIL } },
        update: { key: thumbnailKey, url: thumbnailUrl },
        create: {
          userId,
          type: AvatarType.THUMBNAIL,
          key: thumbnailKey,
          url: thumbnailUrl,
        },
      }),
    ]);

    // Notifica en tiempo real a los chats donde el usuario NO está anónimo.
    this.eventEmitter.emit(PROFILE_UPDATED, { userId } satisfies ProfileUpdatedEvent);

    return { thumbnail: thumbnailUrl, original: originalUrl };
  }

  /** Elimina la foto de perfil del usuario (objetos del bucket + filas en BD). */
  async remove(userId: string): Promise<void> {
    await this.bucket.deleteByPrefix(this.prefix(userId));
    await this.prisma.userAvatar.deleteMany({ where: { userId } });

    // Notifica en tiempo real a los chats donde el usuario NO está anónimo.
    this.eventEmitter.emit(PROFILE_UPDATED, { userId } satisfies ProfileUpdatedEvent);
  }

  /** Ruta del endpoint para ver un avatar (lo que se guarda en `url` y consume el cliente). */
  private apiPath(userId: string, type: AvatarType): string {
    const t = type === AvatarType.THUMBNAIL ? 'thumbnail' : 'original';
    return `/api/v1/avatars/${userId}?type=${t}`;
  }

  /**
   * ¿Puede `viewerId` ver el avatar de `targetId`?
   * - Su propio avatar → sí.
   * - De otro usuario → solo si existe una conversación entre ambos Y el objetivo
   *   NO está en modo anónimo en esa conversación.
   */
  private async canView(viewerId: string, targetId: string): Promise<boolean> {
    if (viewerId === targetId) return true;

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: viewerId, userBId: targetId },
          { userAId: targetId, userBId: viewerId },
        ],
      },
      select: { userAId: true, anonymousA: true, anonymousB: true },
    });
    if (!conversation) return false;

    const targetIsUserA = conversation.userAId === targetId;
    const targetIsAnonymous = targetIsUserA
      ? conversation.anonymousA
      : conversation.anonymousB;

    return !targetIsAnonymous;
  }

  /**
   * Devuelve el contenido binario del avatar (`type`) de `targetId` que puede ver
   * `viewerId`. Lanza `NotFoundException` si no está permitido o no existe — el
   * mismo error en ambos casos, para no revelar si el usuario tiene foto.
   */
  async getAvatarFile(
    viewerId: string,
    targetId: string,
    type: AvatarType,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const notFound = new NotFoundException('Avatar no disponible');

    if (!(await this.canView(viewerId, targetId))) throw notFound;

    const row = await this.prisma.userAvatar.findUnique({
      where: { userId_type: { userId: targetId, type } },
      select: { key: true },
    });
    if (!row) throw notFound;

    const buffer = await this.bucket.getItem(row.key);
    return { buffer, contentType: 'image/webp' };
  }
}
