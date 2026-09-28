import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_ALGORITHM } from '../jwt.constants.js';

/**
 * Variante "tolerante" del access token: valida que el token sea DEL SISTEMA
 * (firma HS256 + issuer + audience) para poder extraer `sub`, PERO NO rechaza
 * por expiración (`ignoreExpiration: true`). Se usa solo en endpoints de bajo
 * riesgo donde el `<img>` no puede refrescar el token (streaming de avatares):
 * así una foto no deja de mostrarse solo porque el access token venció.
 */
@Injectable()
export class AccessTokenLenientStrategy extends PassportStrategy(
  Strategy,
  'access-token-lenient',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.['access_token'] ?? null,
      ]),
      secretOrKey: configService.getOrThrow<string>('jwtSecretAccess'),
      // Diferencia clave: se ignora la expiración (pero sigue validando firma,
      // issuer y audience, así que debe ser un token legítimo del sistema).
      ignoreExpiration: true,
      issuer: configService.getOrThrow<string>('jwtIssuer'),
      audience: configService.getOrThrow<string>('jwtAudience'),
      algorithms: [JWT_ALGORITHM],
    });
  }

  validate(payload: { sub?: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token de acceso no válido');
    }
    return payload;
  }
}
