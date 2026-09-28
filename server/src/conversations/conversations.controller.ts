import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../shared/dtos/index.js';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import type { Request } from '../shared/types/request.js';
import {
  ConversationsService,
  type ChatDetail,
  type ChatListItem,
  type CreatedConversation,
  type MessagesPage,
  type RandomConversation,
} from './conversations.service.js';
import type { MessageItemView } from '../shared/events/message.events.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { GetMessagesQuery } from './dto/get-messages.query.js';
import { SetAnonymityDto } from './dto/set-anonymity.dto.js';

@ApiTags('conversations')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('v1/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Listar todos mis chats, ordenados por la actividad (mensaje) más reciente',
  })
  async list(@Req() req: Request): Promise<ApiResponseDto<ChatListItem[]>> {
    const data = await this.conversationsService.listForUser(req.user.sub);
    return { statusCode: HttpStatus.OK, message: 'Chats obtenidos', data };
  }

  @Post()
  @ApiOperation({ summary: 'Iniciar una conversación con el dueño de un PIN' })
  async create(
    @Req() req: Request,
    @Body() dto: CreateConversationDto,
  ): Promise<ApiResponseDto<CreatedConversation>> {
    const data = await this.conversationsService.createByPin(req.user.sub, dto);
    return {
      statusCode: data.created ? HttpStatus.CREATED : HttpStatus.OK,
      message: data.created ? 'Conversación iniciada' : 'Conversación existente',
      data,
    };
  }

  @Post('random')
  @ApiOperation({
    summary:
      'Iniciar un chat con un usuario aleatorio (sin chat previo); prioriza en línea',
  })
  async random(
    @Req() req: Request,
  ): Promise<ApiResponseDto<RandomConversation>> {
    const data = await this.conversationsService.startRandom(req.user.sub);
    return {
      statusCode: data.created ? HttpStatus.CREATED : HttpStatus.OK,
      message: 'Chat aleatorio iniciado',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un chat (para visualizar su información)' })
  async detail(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponseDto<ChatDetail>> {
    const data = await this.conversationsService.getDetail(req.user.sub, id);
    return { statusCode: HttpStatus.OK, message: 'Chat obtenido', data };
  }

  @Patch(':id/anonymity')
  @ApiOperation({ summary: 'Activar/desactivar MI anonimidad en el chat' })
  async setAnonymity(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetAnonymityDto,
  ): Promise<ApiResponseDto<ChatDetail>> {
    const data = await this.conversationsService.setMyAnonymity(
      req.user.sub,
      id,
      dto.anonymous,
    );
    return { statusCode: HttpStatus.OK, message: 'Anonimidad actualizada', data };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar el chat (mensajes + conversación); solo un participante',
  })
  async remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponseDto<{ deleted: true }>> {
    await this.conversationsService.deleteConversation(req.user.sub, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Chat eliminado',
      data: { deleted: true },
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Historial de mensajes del chat (paginado por cursor)' })
  async messages(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetMessagesQuery,
  ): Promise<ApiResponseDto<MessagesPage>> {
    const data = await this.conversationsService.listMessages(
      req.user.sub,
      id,
      query.before,
      query.limit,
    );
    return { statusCode: HttpStatus.OK, message: 'Mensajes obtenidos', data };
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Enviar un mensaje (opcionalmente respondiendo a otro)' })
  async sendMessage(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMessageDto,
  ): Promise<ApiResponseDto<MessageItemView>> {
    const data = await this.conversationsService.sendMessage(
      req.user.sub,
      id,
      dto,
    );
    return { statusCode: HttpStatus.CREATED, message: 'Mensaje enviado', data };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marcar como leídos los mensajes recibidos del chat' })
  async read(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponseDto<{ readAt: Date | null }>> {
    const data = await this.conversationsService.markRead(req.user.sub, id);
    return { statusCode: HttpStatus.OK, message: 'Marcado como leído', data };
  }
}
