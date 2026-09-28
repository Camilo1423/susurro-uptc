var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ALGORITHM } from '../jwt.constants.js';
let RefreshTokenStrategy = class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(configService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => req?.cookies?.['refresh_token'] ?? null,
            ]),
            secretOrKey: configService.getOrThrow('jwtSecretRefresh'),
            ignoreExpiration: false,
            issuer: configService.getOrThrow('jwtIssuer'),
            audience: configService.getOrThrow('jwtAudience'),
            algorithms: [JWT_ALGORITHM],
        });
    }
    validate(payload) {
        if (!payload?.sub) {
            throw new UnauthorizedException('Refresh token no válido');
        }
        return payload;
    }
};
RefreshTokenStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], RefreshTokenStrategy);
export { RefreshTokenStrategy };
//# sourceMappingURL=refresh-token.strategy.js.map