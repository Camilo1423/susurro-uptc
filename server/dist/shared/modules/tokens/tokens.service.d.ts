import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export interface GeneratedTokens {
    access_token: string;
    refresh_token: string;
    access_jti: string;
    refresh_jti: string;
    session_id: string;
    access_token_expires_at: Date;
    refresh_token_expires_at: Date;
    time_to_access_token_expires: number;
    time_to_refresh_token_expires: number;
}
export declare class TokensService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    private _getTimeUnit;
    private _getTimeInMilliseconds;
    generateTokens(user_id: string, session_id?: string): Promise<GeneratedTokens>;
    generateSocketToken(user_id: string, session_id?: string): Promise<{
        access_token: string;
        access_token_expires_at: string;
        time_to_access_token_expires: number;
    }>;
    verifySocketToken(token: string): Promise<{
        sub: string;
        session_id: string;
    }>;
}
