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
let AccessTokenLenientStrategy = class AccessTokenLenientStrategy extends PassportStrategy(Strategy, 'access-token-lenient') {
    constructor(configService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => req?.cookies?.['access_token'] ?? null,
            ]),
            secretOrKey: configService.getOrThrow('jwtSecretAccess'),
            ignoreExpiration: true,
            issuer: configService.getOrThrow('jwtIssuer'),
            audience: configService.getOrThrow('jwtAudience'),
            algorithms: [JWT_ALGORITHM],
        });
    }
    validate(payload) {
        if (!payload?.sub) {
            throw new UnauthorizedException('Token de acceso no válido');
        }
        return payload;
    }
};
AccessTokenLenientStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], AccessTokenLenientStrategy);
export { AccessTokenLenientStrategy };
//# sourceMappingURL=access-token-lenient.strategy.js.map