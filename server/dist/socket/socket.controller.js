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
import { Controller, HttpException, HttpStatus, InternalServerErrorException, Post, Req, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import { SocketService } from './socket.service.js';
let SocketController = class SocketController {
    socketService;
    constructor(socketService) {
        this.socketService = socketService;
    }
    async socketToken(req) {
        try {
            const { sub, session_id } = req.user;
            const data = await this.socketService.generateSocketToken(sub, session_id);
            return {
                statusCode: HttpStatus.OK,
                message: 'Token de socket generado',
                data,
            };
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al generar token de socket');
        }
    }
};
__decorate([
    UseGuards(AccessTokenGuard),
    ApiBearerAuth('access-token'),
    Post('auth/socket-token'),
    ApiOperation({ summary: 'Emitir token efímero para conectar el socket' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketController.prototype, "socketToken", null);
SocketController = __decorate([
    ApiTags('socket'),
    Controller('v1/socket'),
    __metadata("design:paramtypes", [SocketService])
], SocketController);
export { SocketController };
//# sourceMappingURL=socket.controller.js.map