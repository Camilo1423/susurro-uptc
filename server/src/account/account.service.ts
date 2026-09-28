import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { UserBase } from '../auth/interfaces/sign-in.interface.js';
import { toUserSession } from '../auth/user-session.mapper.js';
import {
  PROFILE_UPDATED,
  type ProfileUpdatedEvent,
} from '../shared/events/profile.events.js';
import { UpdateInfoDto } from './dto/update-info.dto.js';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Actualiza los datos personales del usuario autenticado y devuelve el usuario
   * en la MISMA forma que el login (`UserBase`), para que el cliente refresque su
   * sesión.
   */
  async updateInfo(userId: string, dto: UpdateInfoDto): Promise<UserBase> {
    try {
      if (dto.documentTypeId) {
        const documentType = await this.prisma.documentType.findUnique({
          where: { id: dto.documentTypeId },
          select: { id: true },
        });
        if (!documentType) {
          throw new BadRequestException('El tipo de documento no existe');
        }
      }

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { ...dto },
        include: {
          documentType: { select: { code: true, name: true } },
          avatars: { select: { type: true, url: true } },
        },
      });

      // Si cambió el NOMBRE (lo único visible para la contraparte), notifica en
      // tiempo real a los chats donde el usuario NO está anónimo.
      const nameChanged =
        dto.firstName !== undefined ||
        dto.secondName !== undefined ||
        dto.firstLastName !== undefined ||
        dto.secondLastName !== undefined;
      if (nameChanged) {
        this.eventEmitter.emit(PROFILE_UPDATED, {
          userId,
        } satisfies ProfileUpdatedEvent);
      }

      return toUserSession(user);
    } catch (error) {
      this.logger.error('Error al actualizar datos personales:', error);
      throw error;
    }
  }
}
