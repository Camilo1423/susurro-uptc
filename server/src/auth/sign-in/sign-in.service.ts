import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../shared/modules/prisma/index.js';
import { RedisService } from '../../shared/modules/redis/index.js';
import { TokensService } from '../../shared/modules/tokens/index.js';
import { SignIn, TokensOnSignIn, UserBase } from '../interfaces/sign-in.interface.js';
import { Tokens } from '../interfaces/tokens.interface.js';
import { toUserSession } from '../user-session.mapper.js';
import { AuthUserWebDto } from './dto/sign-in.dto.js';

@Injectable()
export class SignInService {
  private readonly logger = new Logger(SignInService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  /** Segundos restantes hasta `expiresAt` (0 o menos → ya expiró). */
  private _ttlSeconds(expiresAt: Date): number {
    return Math.ceil((expiresAt.getTime() - Date.now()) / 1000);
  }

  /**
   * Registra un intento fallido. Al llegar al máximo bloquea al usuario
   * (guardando la hora) e inhabilita/revoca sus sesiones. Siempre lanza.
   */
  private async _registerFailedAttempt(
    userId: string,
    currentAttempts: number,
  ): Promise<never> {
    const maxAttempts = this.configService.getOrThrow<number>(
      'security.maxFailedAttempts',
    );
    const attempts = currentAttempts + 1;

    if (attempts >= maxAttempts) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedAttempts: attempts, blockedAt: new Date() },
      });
      await this._revokeAllSessions(userId);
      throw new UnauthorizedException(
        'Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador.',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: attempts },
    });

    if (attempts === maxAttempts - 1) {
      throw new BadRequestException(
        'Contraseña incorrecta. Un intento fallido más y su usuario será bloqueado.',
      );
    }
    throw new BadRequestException('Contraseña incorrecta');
  }

  /**
   * Revoca TODAS las sesiones y refresh tokens del usuario: los agrega a la
   * blacklist de Redis (por JTI, con el TTL restante) y a la tabla persistente,
   * y los marca inactivos/revocados en BD.
   */
  private async _revokeAllSessions(userId: string): Promise<void> {
    const [sessions, refreshTokens] = await Promise.all([
      this.prisma.session.findMany({
        where: { userId, isActive: true },
        select: { jti: true, expiresAt: true },
      }),
      this.prisma.refreshToken.findMany({
        where: { userId, isRevoked: false },
        select: { jti: true, expiresAt: true },
      }),
    ]);

    const redisWrites: Promise<unknown>[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (const session of sessions) {
        const ttl = this._ttlSeconds(session.expiresAt);
        if (ttl > 0) {
          await tx.blackListAccessToken.create({
            data: { userId, jti: session.jti, expiresAt: session.expiresAt },
          });
          redisWrites.push(
            this.redis.set(`blacklist:access:${session.jti}`, '1', { ttl }),
          );
        }
      }
      await tx.session.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false, expiresAt: new Date() },
      });

      for (const refreshToken of refreshTokens) {
        const ttl = this._ttlSeconds(refreshToken.expiresAt);
        if (ttl > 0) {
          redisWrites.push(
            this.redis.set(`blacklist:refresh:${refreshToken.jti}`, '1', { ttl }),
          );
        }
      }
      await tx.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    });

    await Promise.all(redisWrites);
  }

  async signIn(
    user: AuthUserWebDto,
    ip: string,
    userAgent: string,
  ): Promise<SignIn & TokensOnSignIn> {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: { email: user.email },
        include: {
          documentType: { select: { code: true, name: true } },
          avatars: { select: { type: true, url: true } },
        },
      });
      if (!foundUser) throw new BadRequestException('Usuario no encontrado');

      if (foundUser.blockedAt) {
        throw new UnauthorizedException(
          'Usuario bloqueado por seguridad. Contacte al administrador.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        user.password,
        foundUser.password,
      );
      if (!isPasswordValid) {
        await this._registerFailedAttempt(
          foundUser.id,
          foundUser.failedAttempts,
        );
      }

      if (foundUser.status === 'PENDING') {
        throw new BadRequestException(
          'Verifique su correo electrónico para activar su cuenta.',
        );
      }
      if (foundUser.status === 'INACTIVE') {
        throw new BadRequestException('Usuario inactivo');
      }
      if (foundUser.status === 'SUSPENDED') {
        throw new BadRequestException('Usuario suspendido');
      }

      const tokens = await this.tokenService.generateTokens(foundUser.id);

      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: foundUser.id },
          data: {
            lastLogin: new Date(),
            failedAttempts: 0,
            lockedUntil: null,
            blockedAt: null,
          },
        });

        await tx.session.create({
          data: {
            userId: foundUser.id,
            ipAddress: ip,
            userAgent,
            sessionKey: tokens.session_id,
            jti: tokens.access_jti,
            expiresAt: tokens.access_token_expires_at,
          },
        });

        await tx.refreshToken.create({
          data: {
            userId: foundUser.id,
            sessionKey: tokens.session_id,
            jti: tokens.refresh_jti,
            expiresAt: tokens.refresh_token_expires_at,
          },
        });
      });

      return {
        ...toUserSession(foundUser),
        tokens: {
          access_tk: tokens.access_token,
          refresh_tk: tokens.refresh_token,
          time_to_access_token_expires: tokens.time_to_access_token_expires,
          time_to_refresh_token_expires: tokens.time_to_refresh_token_expires,
        },
      };
    } catch (error) {
      this.logger.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async refreshToken(
    refresh_jti: string,
    session_id: string,
    user_id: string,
    ip: string,
    userAgent: string,
  ): Promise<Tokens> {
    try {
      const current = await this.prisma.refreshToken.findFirst({
        where: {
          jti: refresh_jti,
          userId: user_id,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
      });
      if (!current) {
        throw new BadRequestException('Refresh token inválido o expirado');
      }

      const tokens = await this.tokenService.generateTokens(
        user_id,
        session_id,
      );

      const redisWrites: Promise<unknown>[] = [];

      await this.prisma.$transaction(async (tx) => {
        const existingSession = await tx.session.findFirst({
          where: { sessionKey: session_id, userId: user_id },
        });

        if (existingSession) {
          // Revoca el access token anterior (Redis + blacklist persistente).
          const accessTtl = this._ttlSeconds(existingSession.expiresAt);
          if (accessTtl > 0) {
            await tx.blackListAccessToken.create({
              data: {
                userId: user_id,
                jti: existingSession.jti,
                expiresAt: existingSession.expiresAt,
              },
            });
            redisWrites.push(
              this.redis.set(
                `blacklist:access:${existingSession.jti}`,
                '1',
                { ttl: accessTtl },
              ),
            );
          }

          await tx.session.update({
            where: { id: existingSession.id },
            data: {
              jti: tokens.access_jti,
              expiresAt: tokens.access_token_expires_at,
              isActive: true,
              ipAddress: ip,
              userAgent,
            },
          });
        } else {
          await tx.session.create({
            data: {
              userId: user_id,
              ipAddress: ip,
              userAgent,
              sessionKey: session_id,
              jti: tokens.access_jti,
              expiresAt: tokens.access_token_expires_at,
            },
          });
        }

        // Rotación: revoca el refresh usado (Redis + BD) y emite uno nuevo.
        const refreshTtl = this._ttlSeconds(current.expiresAt);
        if (refreshTtl > 0) {
          redisWrites.push(
            this.redis.set(`blacklist:refresh:${refresh_jti}`, '1', {
              ttl: refreshTtl,
            }),
          );
        }
        await tx.refreshToken.update({
          where: { id: current.id },
          data: { isRevoked: true },
        });
        await tx.refreshToken.create({
          data: {
            userId: user_id,
            sessionKey: session_id,
            jti: tokens.refresh_jti,
            expiresAt: tokens.refresh_token_expires_at,
          },
        });
      });

      await Promise.all(redisWrites);

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        timeToAccessTokenExpires: tokens.time_to_access_token_expires,
        timeToRefreshTokenExpires: tokens.time_to_refresh_token_expires,
      };
    } catch (error) {
      this.logger.error('Error al refrescar token:', error);
      throw error;
    }
  }

  async whoAmI(
    session_id: string,
    userId: string,
    ip: string,
    userAgent: string,
  ): Promise<UserBase> {
    try {
      const [session, user] = await Promise.all([
        this.prisma.session.findFirst({
          where: {
            sessionKey: session_id,
            userId,
            isActive: true,
            expiresAt: { gt: new Date() },
          },
        }),
        this.prisma.user.findFirst({
          where: { id: userId },
          include: {
          documentType: { select: { code: true, name: true } },
          avatars: { select: { type: true, url: true } },
        },
        }),
      ]);

      if (!session || !user) {
        throw new UnauthorizedException('Sesión no autorizada');
      }

      await this.prisma.session.update({
        where: { id: session.id },
        data: { ipAddress: ip, userAgent },
      });

      return toUserSession(user);
    } catch (error) {
      this.logger.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }

  /**
   * Cierra una sesión (logout): revoca su access token (Redis + blacklist en BD)
   * y su refresh token (Redis + `isRevoked` en BD), y desactiva la sesión.
   */
  async invalidateSession(
    userId: string,
    session_id: string,
    refresh_jti: string,
  ): Promise<void> {
    try {
      const [existingSession, refreshToken] = await Promise.all([
        this.prisma.session.findFirst({
          where: { sessionKey: session_id, userId },
          select: { id: true, jti: true, expiresAt: true },
        }),
        this.prisma.refreshToken.findFirst({
          where: { userId, jti: refresh_jti, isRevoked: false },
        }),
      ]);

      if (!refreshToken) throw new BadRequestException('Token inválido');

      const redisWrites: Promise<unknown>[] = [];

      await this.prisma.$transaction(async (tx) => {
        if (existingSession) {
          const accessTtl = this._ttlSeconds(existingSession.expiresAt);
          if (accessTtl > 0) {
            await tx.blackListAccessToken.create({
              data: {
                userId,
                jti: existingSession.jti,
                expiresAt: existingSession.expiresAt,
              },
            });
            redisWrites.push(
              this.redis.set(
                `blacklist:access:${existingSession.jti}`,
                '1',
                { ttl: accessTtl },
              ),
            );
          }
        }

        await tx.session.updateMany({
          where: { sessionKey: session_id, userId },
          data: { expiresAt: new Date(), isActive: false },
        });

        await tx.refreshToken.update({
          where: { id: refreshToken.id },
          data: { isRevoked: true },
        });
      });

      const refreshTtl = this._ttlSeconds(refreshToken.expiresAt);
      if (refreshTtl > 0) {
        redisWrites.push(
          this.redis.set(`blacklist:refresh:${refresh_jti}`, '1', {
            ttl: refreshTtl,
          }),
        );
      }

      await Promise.all(redisWrites);
    } catch (error) {
      this.logger.error('Error al invalidar sesión:', error);
      throw error;
    }
  }
}
