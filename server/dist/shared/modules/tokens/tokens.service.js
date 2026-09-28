var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { JWT_ALGORITHM } from './jwt.constants.js';
const asExpiresIn = (duration) => duration;
let TokensService = class TokensService {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    _getTimeUnit(timeString) {
        if (timeString.includes('a'))
            return 'a';
        if (timeString.includes('d'))
            return 'd';
        if (timeString.includes('h'))
            return 'h';
        if (timeString.includes('m'))
            return 'm';
        return 's';
    }
    _getTimeInMilliseconds(duration) {
        const unit = this._getTimeUnit(duration);
        const value = Number.parseInt(duration.slice(0, -1), 10);
        const multipliers = {
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
    async generateTokens(user_id, session_id) {
        const sessionId = session_id || randomUUID();
        const accessJti = randomUUID();
        const refreshJti = randomUUID();
        const issuer = this.configService.getOrThrow('jwtIssuer');
        const audience = this.configService.getOrThrow('jwtAudience');
        const accessDuration = this.configService.getOrThrow('jwtExpiresInAccess');
        const refreshDuration = this.configService.getOrThrow('jwtExpiresInRefresh');
        const now = new Date();
        const accessExpiresAt = new Date(now.getTime() + this._getTimeInMilliseconds(accessDuration));
        const refreshExpiresAt = new Date(now.getTime() + this._getTimeInMilliseconds(refreshDuration));
        const accessToken = this.jwtService.sign({ sub: user_id, jti: accessJti, session_id: sessionId }, {
            secret: this.configService.getOrThrow('jwtSecretAccess'),
            expiresIn: asExpiresIn(accessDuration),
            issuer,
            audience,
            algorithm: JWT_ALGORITHM,
        });
        const refreshToken = this.jwtService.sign({ sub: user_id, jti: refreshJti, session_id: sessionId }, {
            secret: this.configService.getOrThrow('jwtSecretRefresh'),
            expiresIn: asExpiresIn(refreshDuration),
            issuer,
            audience,
            algorithm: JWT_ALGORITHM,
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            access_jti: accessJti,
            refresh_jti: refreshJti,
            session_id: sessionId,
            access_token_expires_at: accessExpiresAt,
            refresh_token_expires_at: refreshExpiresAt,
            time_to_access_token_expires: this._getTimeInMilliseconds(accessDuration),
            time_to_refresh_token_expires: this._getTimeInMilliseconds(refreshDuration),
        };
    }
    async generateSocketToken(user_id, session_id) {
        const duration = this.configService.getOrThrow('jwtExpiresInSocket');
        const expiresAt = new Date(Date.now() + this._getTimeInMilliseconds(duration));
        const token = this.jwtService.sign({ sub: user_id, session_id: session_id ?? randomUUID() }, {
            secret: this.configService.getOrThrow('jwtSecretSocket'),
            expiresIn: asExpiresIn(duration),
            issuer: this.configService.getOrThrow('jwtIssuer'),
            audience: this.configService.getOrThrow('jwtAudience'),
            algorithm: JWT_ALGORITHM,
        });
        return {
            access_token: token,
            access_token_expires_at: expiresAt.toISOString(),
            time_to_access_token_expires: this._getTimeInMilliseconds(duration),
        };
    }
    async verifySocketToken(token) {
        return this.jwtService.verify(token, {
            secret: this.configService.getOrThrow('jwtSecretSocket'),
            issuer: this.configService.getOrThrow('jwtIssuer'),
            audience: this.configService.getOrThrow('jwtAudience'),
            algorithms: [JWT_ALGORITHM],
        });
    }
};
TokensService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        ConfigService])
], TokensService);
export { TokensService };
//# sourceMappingURL=tokens.service.js.map