import { Module } from '@nestjs/common';
import { SocketProvider } from '../shared/providers/socket/socket.provider.js';
import { SocketController } from './socket.controller.js';
import { SocketService } from './socket.service.js';

@Module({
  controllers: [SocketController],
  providers: [SocketService, SocketProvider],
  exports: [SocketProvider],
})
export class SocketModule {}
