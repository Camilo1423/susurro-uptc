import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RedisService } from '../../redis/index.js';

/**
 * Guard del access token. Valida el JWT (estrategia `access-token`), rechaza los
 * revocados consultando la blacklist de Redis por JTI y adjunta el token crudo
 * en `req.user.token`.
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {
  constructor(private readonly redis: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    if (!activate) throw new UnauthorizedException();

    const request = context.switchToHttp().getRequest<Request>();

    const jti: string | undefined = (request.user as { jti?: string })?.jti;
    if (jti && (await this.redis.exists(`blacklist:access:${jti}`)) > 0) {
      throw new UnauthorizedException('Token revocado');
    }

    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    request.user = { ...(request.user as object), token };
    return true;
  }
}
