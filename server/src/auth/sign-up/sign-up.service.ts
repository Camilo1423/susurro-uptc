import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../shared/modules/prisma/index.js';
import { generatePin } from '../../shared/utils/pin.util.js';
import { UserBase } from '../interfaces/sign-in.interface.js';
import { toUserSession } from '../user-session.mapper.js';
import { SignUpDto } from './dto/sign-up.dto.js';

/** Rondas de bcrypt para el hash de contraseñas. */
const BCRYPT_ROUNDS = 10;
/** Reintentos para generar un PIN único. */
const PIN_MAX_ATTEMPTS = 5;

@Injectable()
export class SignUpService {
  private readonly logger = new Logger(SignUpService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Genera un PIN único en el sistema (reintenta si choca). */
  private async _generateUniquePin(): Promise<string> {
    for (let i = 0; i < PIN_MAX_ATTEMPTS; i++) {
      const pin = generatePin();
      const existing = await this.prisma.user.findUnique({
        where: { pin },
        select: { id: true },
      });
      if (!existing) return pin;
    }
    throw new ConflictException(
      'No se pudo generar un PIN único, intente de nuevo',
    );
  }

  /**
   * Registra un usuario. Para simplificar la app, queda ACTIVO y con el correo
   * confirmado (sin flujo de verificación). Genera su PIN único.
   */
  async signUp(dto: SignUpDto): Promise<UserBase> {
    try {
      const documentType = await this.prisma.documentType.findUnique({
        where: { id: dto.documentTypeId },
        select: { id: true },
      });
      if (!documentType) {
        throw new BadRequestException('El tipo de documento no existe');
      }

      const existing = await this.prisma.user.findFirst({
        where: { OR: [{ email: dto.email }, { username: dto.username }] },
        select: { email: true, username: true },
      });
      if (existing) {
        const field =
          existing.email === dto.email ? 'correo' : 'nombre de usuario';
        throw new ConflictException(`Ya existe un usuario con ese ${field}`);
      }

      const password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
      const pin = await this._generateUniquePin();

      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password,
          pin,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        },
        include: {
          documentType: { select: { code: true, name: true } },
          avatars: { select: { type: true, url: true } },
        },
      });

      return toUserSession(user);
    } catch (error) {
      this.logger.error('Error al registrar usuario:', error);
      throw error;
    }
  }
}
