import { Request as ExpressRequest } from 'express';

/** Identidad extraída del JWT y adjuntada por los guards de token. */
export interface TokenUser {
  sub: string;
  jti: string;
  session_id: string;
  token: string;
}

/** Request de Express enriquecido con el usuario autenticado. */
export type Request = ExpressRequest & {
  user: TokenUser;
};
