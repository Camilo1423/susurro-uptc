import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_ALGORITHM } from '../jwt.constants.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.['access_token'] ?? null,
      ]),
      secretOrKey: configService.getOrThrow<string>('jwtSecretAccess'),
      ignoreExpiration: false,
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
