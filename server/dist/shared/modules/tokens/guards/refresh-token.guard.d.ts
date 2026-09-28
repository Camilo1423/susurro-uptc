import { ExecutionContext } from '@nestjs/common';
import { RedisService } from '../../redis/index.js';
declare const RefreshTokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class RefreshTokenGuard extends RefreshTokenGuard_base {
    private readonly redis;
    constructor(redis: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
