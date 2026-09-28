var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../../redis/index.js';
let RefreshTokenGuard = class RefreshTokenGuard extends AuthGuard('refresh-token') {
    redis;
    constructor(redis) {
        super();
        this.redis = redis;
    }
    async canActivate(context) {
        const activate = (await super.canActivate(context));
        if (!activate)
            throw new UnauthorizedException();
        const request = context.switchToHttp().getRequest();
        const jti = request.user?.jti;
        if (jti && (await this.redis.exists(`blacklist:refresh:${jti}`)) > 0) {
            throw new UnauthorizedException('Token revocado');
        }
        const authHeader = request.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        request.user = { ...request.user, token };
        return true;
    }
};
RefreshTokenGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [RedisService])
], RefreshTokenGuard);
export { RefreshTokenGuard };
//# sourceMappingURL=refresh-token.guard.js.map