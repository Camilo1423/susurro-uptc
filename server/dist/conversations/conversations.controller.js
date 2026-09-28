var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import { ConversationsService, } from './conversations.service.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { GetMessagesQuery } from './dto/get-messages.query.js';
import { SetAnonymityDto } from './dto/set-anonymity.dto.js';
let ConversationsController = class ConversationsController {
    conversationsService;
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async list(req) {
        const data = await this.conversationsService.listForUser(req.user.sub);
        return { statusCode: HttpStatus.OK, message: 'Chats obtenidos', data };
    }
    async create(req, dto) {
        const data = await this.conversationsService.createByPin(req.user.sub, dto);
        return {
            statusCode: data.created ? HttpStatus.CREATED : HttpStatus.OK,
            message: data.created ? 'Conversación iniciada' : 'Conversación existente',
            data,
        };
    }
    async random(req) {
        const data = await this.conversationsService.startRandom(req.user.sub);
        return {
            statusCode: data.created ? HttpStatus.CREATED : HttpStatus.OK,
            message: 'Chat aleatorio iniciado',
            data,
        };
    }
    async detail(req, id) {
        const data = await this.conversationsService.getDetail(req.user.sub, id);
        return { statusCode: HttpStatus.OK, message: 'Chat obtenido', data };
    }
    async setAnonymity(req, id, dto) {
        const data = await this.conversationsService.setMyAnonymity(req.user.sub, id, dto.anonymous);
        return { statusCode: HttpStatus.OK, message: 'Anonimidad actualizada', data };
    }
    async remove(req, id) {
        await this.conversationsService.deleteConversation(req.user.sub, id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Chat eliminado',
            data: { deleted: true },
        };
    }
    async messages(req, id, query) {
        const data = await this.conversationsService.listMessages(req.user.sub, id, query.before, query.limit);
        return { statusCode: HttpStatus.OK, message: 'Mensajes obtenidos', data };
    }
    async sendMessage(req, id, dto) {
        const data = await this.conversationsService.sendMessage(req.user.sub, id, dto);
        return { statusCode: HttpStatus.CREATED, message: 'Mensaje enviado', data };
    }
    async read(req, id) {
        const data = await this.conversationsService.markRead(req.user.sub, id);
        return { statusCode: HttpStatus.OK, message: 'Marcado como leído', data };
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Listar todos mis chats, ordenados por la actividad (mensaje) más reciente',
    }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "list", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Iniciar una conversación con el dueño de un PIN' }),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "create", null);
__decorate([
    Post('random'),
    ApiOperation({
        summary: 'Iniciar un chat con un usuario aleatorio (sin chat previo); prioriza en línea',
    }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "random", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Detalle de un chat (para visualizar su información)' }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "detail", null);
__decorate([
    Patch(':id/anonymity'),
    ApiOperation({ summary: 'Activar/desactivar MI anonimidad en el chat' }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SetAnonymityDto]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "setAnonymity", null);
__decorate([
    Delete(':id'),
    ApiOperation({
        summary: 'Eliminar el chat (mensajes + conversación); solo un participante',
    }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "remove", null);
__decorate([
    Get(':id/messages'),
    ApiOperation({ summary: 'Historial de mensajes del chat (paginado por cursor)' }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, GetMessagesQuery]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "messages", null);
__decorate([
    Post(':id/messages'),
    ApiOperation({ summary: 'Enviar un mensaje (opcionalmente respondiendo a otro)' }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateMessageDto]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "sendMessage", null);
__decorate([
    Post(':id/read'),
    ApiOperation({ summary: 'Marcar como leídos los mensajes recibidos del chat' }),
    __param(0, Req()),
    __param(1, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "read", null);
ConversationsController = __decorate([
    ApiTags('conversations'),
    ApiBearerAuth('access-token'),
    UseGuards(AccessTokenGuard),
    Controller('v1/conversations'),
    __metadata("design:paramtypes", [ConversationsService])
], ConversationsController);
export { ConversationsController };
//# sourceMappingURL=conversations.controller.js.map