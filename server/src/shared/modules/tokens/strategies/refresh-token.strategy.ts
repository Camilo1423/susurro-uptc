import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_ALGORITHM } from '../jwt.constants.js';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.['refresh_token'] ?? null,
      ]),
      secretOrKey: configService.getOrThrow<string>('jwtSecretRefresh'),
      ignoreExpiration: false,
      issuer: configService.getOrThrow<string>('jwtIssuer'),
      audience: configService.getOrThrow<string>('jwtAudience'),
      algorithms: [JWT_ALGORITHM],
    });
  }

  validate(payload: { sub?: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Refresh token no válido');
    }
    return payload;
  }
}
