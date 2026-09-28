import { TokensService } from '../shared/modules/tokens/index.js';
export declare class SocketService {
    private readonly tokensService;
    private readonly logger;
    constructor(tokensService: TokensService);
    generateSocketToken(user_id: string, session_id?: string): Promise<{
        access_token: string;
        access_token_expires_at: string;
        time_to_access_token_expires: number;
    }>;
}
