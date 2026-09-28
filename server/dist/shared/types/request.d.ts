import { Request as ExpressRequest } from 'express';
export interface TokenUser {
    sub: string;
    jti: string;
    session_id: string;
    token: string;
}
export type Request = ExpressRequest & {
    user: TokenUser;
};
