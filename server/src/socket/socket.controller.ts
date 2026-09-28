import {
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../shared/dtos/index.js';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import type { Request } from '../shared/types/request.js';
import { SocketService } from './socket.service.js';

@ApiTags('socket')
@Controller('v1/socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @Post('auth/socket-token')
  @ApiOperation({ summary: 'Emitir token efímero para conectar el socket' })
  async socketToken(@Req() req: Request): Promise<ApiResponseDto<unknown>> {
    try {
      const { sub, session_id } = req.user;
      const data = await this.socketService.generateSocketToken(
        sub,
        session_id,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Token de socket generado',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al generar token de socket');
    }
  }
}
