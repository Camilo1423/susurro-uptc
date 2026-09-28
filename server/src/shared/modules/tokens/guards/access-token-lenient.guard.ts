import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard tolerante: usa la estrategia `access-token-lenient` (valida firma/issuer/
 * audience pero NO la expiración) y NO consulta la blacklist de revocación. Solo
 * garantiza que el token sea del sistema para extraer `sub` (`req.user.sub`).
 */
@Injectable()
export class AccessTokenLenientGuard extends AuthGuard('access-token-lenient') {}
