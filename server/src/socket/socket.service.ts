import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TokensService } from '../shared/modules/tokens/index.js';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  constructor(private readonly tokensService: TokensService) {}

  /** Emite un token efímero para autenticar la conexión de socket del usuario. */
  async generateSocketToken(user_id: string, session_id?: string) {
    try {
      return await this.tokensService.generateSocketToken(user_id, session_id);
    } catch (error) {
      this.logger.error('Error al generar token de socket:', error);
      throw new InternalServerErrorException(
        'Error al generar token de socket',
      );
    }
  }
}
