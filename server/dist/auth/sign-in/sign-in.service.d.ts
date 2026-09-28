import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../shared/modules/prisma/index.js';
import { RedisService } from '../../shared/modules/redis/index.js';
import { TokensService } from '../../shared/modules/tokens/index.js';
import { SignIn, TokensOnSignIn, UserBase } from '../interfaces/sign-in.interface.js';
import { Tokens } from '../interfaces/tokens.interface.js';
import { AuthUserWebDto } from './dto/sign-in.dto.js';
export declare class SignInService {
    private readonly prisma;
    private readonly tokenService;
    private readonly configService;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, tokenService: TokensService, configService: ConfigService, redis: RedisService);
    private _ttlSeconds;
    private _registerFailedAttempt;
    private _revokeAllSessions;
    signIn(user: AuthUserWebDto, ip: string, userAgent: string): Promise<SignIn & TokensOnSignIn>;
    refreshToken(refresh_jti: string, session_id: string, user_id: string, ip: string, userAgent: string): Promise<Tokens>;
    whoAmI(session_id: string, userId: string, ip: string, userAgent: string): Promise<UserBase>;
    invalidateSession(userId: string, session_id: string, refresh_jti: string): Promise<void>;
}
