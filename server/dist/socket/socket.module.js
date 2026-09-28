var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SocketProvider } from '../shared/providers/socket/socket.provider.js';
import { SocketController } from './socket.controller.js';
import { SocketService } from './socket.service.js';
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    Module({
        controllers: [SocketController],
        providers: [SocketService, SocketProvider],
        exports: [SocketProvider],
    })
], SocketModule);
export { SocketModule };
//# sourceMappingURL=socket.module.js.map