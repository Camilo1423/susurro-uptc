import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Copia el token de las cookies httpOnly al header `Authorization: Bearer`, para
 * que las estrategias de Passport (que leen del header) funcionen aunque el
 * cliente use cookies. Con `?rf=true` usa el `refresh_token`; si no, el
 * `access_token`. Si ya viene un header Authorization, no hace nada.
 */
@Injectable()
export class CookieToBearerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (req.headers.authorization) return next();
    if (!req.cookies || typeof req.cookies !== 'object') return next();

    const useRefreshToken = this._shouldUseRefreshToken(req);
    const tokenKey = useRefreshToken ? 'refresh_token' : 'access_token';
    const token: string | undefined = req.cookies[tokenKey];

    if (!token) return next();

    req.headers.authorization = `Bearer ${token}`;
    next();
  }

  private _shouldUseRefreshToken(req: Request): boolean {
    const rf = req.query.rf as string;
    return rf === 'true' || rf === '1';
  }
}
