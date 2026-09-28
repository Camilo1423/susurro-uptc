import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { JWT_ALGORITHM } from './jwt.constants.js';

/**
 * Duraciones tipo "15m"/"7d". jsonwebtoken las acepta en runtime; el tipo de
 * `expiresIn` (number | StringValue) no incluye `string` genérico, así que se
 * normaliza aquí en un único punto.
 */
type ExpiresIn = JwtSignOptions['expiresIn'];
const asExpiresIn = (duration: string): ExpiresIn => duration as unknown as ExpiresIn;

export interface GeneratedTokens {
  access_token: string;
  refresh_token: string;
  access_jti: string;
  refresh_jti: string;
  session_id: string;
  access_token_expires_at: Date;
  refresh_token_expires_at: Date;
  time_to_access_token_expires: number;
  time_to_refresh_token_expires: number;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private _getTimeUnit(timeString: string): string {
    if (timeString.includes('a')) return 'a';
    if (timeString.includes('d')) return 'd';
    if (timeString.includes('h')) return 'h';
    if (timeString.includes('m')) return 'm';
    return 's';
  }

  /** Convierte "15m" | "7d" | "1h" | "30s" | "1a" a milisegundos. */
  private _getTimeInMilliseconds(duration: string): number {
    const unit = this._getTimeUnit(duration);
    const value = Number.parseInt(duration.slice(0, -1), 10);

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      a: 365 * 24 * 60 * 60 * 1000,
    };

    const multiplier = multipliers[unit];
    if (!multiplier) {
      throw new Error(`Unidad de tiempo inválida: ${unit}. Use s, m, h, d o a.`);
    }
    return value * multiplier;
  }

  /**
   * Genera el par access/refresh. El payload es mínimo (sub, jti, session_id):
   * NADA de permisos/roles. Reutiliza `session_id` en el refresh para mantener
   * la misma sesión.
   */
  async generateTokens(
    user_id: string,
    session_id?: string,
  ): Promise<GeneratedTokens> {
    const sessionId = session_id || randomUUID();
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const issuer = this.configService.getOrThrow<string>('jwtIssuer');
    const audience = this.configService.getOrThrow<string>('jwtAudience');
    const accessDuration = this.configService.getOrThrow<string>(
      'jwtExpiresInAccess',
    );
    const refreshDuration = this.configService.getOrThrow<string>(
      'jwtExpiresInRefresh',
    );

    const now = new Date();
    const accessExpiresAt = new Date(
      now.getTime() + this._getTimeInMilliseconds(accessDuration),
    );
    const refreshExpiresAt = new Date(
      now.getTime() + this._getTimeInMilliseconds(refreshDuration),
    );

    const accessToken = this.jwtService.sign(
      { sub: user_id, jti: accessJti, session_id: sessionId },
      {
        secret: this.configService.getOrThrow<string>('jwtSecretAccess'),
        expiresIn: asExpiresIn(accessDuration),
        issuer,
        audience,
        algorithm: JWT_ALGORITHM,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user_id, jti: refreshJti, session_id: sessionId },
      {
        secret: this.configService.getOrThrow<string>('jwtSecretRefresh'),
        expiresIn: asExpiresIn(refreshDuration),
        issuer,
        audience,
        algorithm: JWT_ALGORITHM,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_jti: accessJti,
      refresh_jti: refreshJti,
      session_id: sessionId,
      access_token_expires_at: accessExpiresAt,
      refresh_token_expires_at: refreshExpiresAt,
      time_to_access_token_expires:
        this._getTimeInMilliseconds(accessDuration),
      time_to_refresh_token_expires:
        this._getTimeInMilliseconds(refreshDuration),
    };
  }

  /**
   * Genera un token EFÍMERO para autenticar la conexión de socket. Datos mínimos
   * (sub + session_id). Se pasa en `handshake.auth.token` y se verifica con
   * `verifySocketToken`.
   */
  async generateSocketToken(
    user_id: string,
    session_id?: string,
  ): Promise<{
    access_token: string;
    access_token_expires_at: string;
    time_to_access_token_expires: number;
  }> {
    const duration = this.configService.getOrThrow<string>('jwtExpiresInSocket');
    const expiresAt = new Date(
      Date.now() + this._getTimeInMilliseconds(duration),
    );

    const token = this.jwtService.sign(
      { sub: user_id, session_id: session_id ?? randomUUID() },
      {
        secret: this.configService.getOrThrow<string>('jwtSecretSocket'),
        expiresIn: asExpiresIn(duration),
        issuer: this.configService.getOrThrow<string>('jwtIssuer'),
        audience: this.configService.getOrThrow<string>('jwtAudience'),
        algorithm: JWT_ALGORITHM,
      },
    );

    return {
      access_token: token,
      access_token_expires_at: expiresAt.toISOString(),
      time_to_access_token_expires: this._getTimeInMilliseconds(duration),
    };
  }

  /** Verifica un token de socket. Devuelve el payload (sub + session_id). */
  async verifySocketToken(
    token: string,
  ): Promise<{ sub: string; session_id: string }> {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('jwtSecretSocket'),
      issuer: this.configService.getOrThrow<string>('jwtIssuer'),
      audience: this.configService.getOrThrow<string>('jwtAudience'),
      algorithms: [JWT_ALGORITHM],
    });
  }
}
