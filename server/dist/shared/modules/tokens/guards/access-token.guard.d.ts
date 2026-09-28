import { ExecutionContext } from '@nestjs/common';
import { RedisService } from '../../redis/index.js';
declare const AccessTokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AccessTokenGuard extends AccessTokenGuard_base {
    private readonly redis;
    constructor(redis: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
