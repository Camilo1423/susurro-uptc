var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SocketService_1;
import { Injectable, InternalServerErrorException, Logger, } from '@nestjs/common';
import { TokensService } from '../shared/modules/tokens/index.js';
let SocketService = SocketService_1 = class SocketService {
    tokensService;
    logger = new Logger(SocketService_1.name);
    constructor(tokensService) {
        this.tokensService = tokensService;
    }
    async generateSocketToken(user_id, session_id) {
        try {
            return await this.tokensService.generateSocketToken(user_id, session_id);
        }
        catch (error) {
            this.logger.error('Error al generar token de socket:', error);
            throw new InternalServerErrorException('Error al generar token de socket');
        }
    }
};
SocketService = SocketService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TokensService])
], SocketService);
export { SocketService };
//# sourceMappingURL=socket.service.js.map