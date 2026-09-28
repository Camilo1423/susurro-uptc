var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SocketProvider_1;
import { Logger, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CONVERSATION_COUNTERPART_UPDATED, CONVERSATION_CREATED, CONVERSATION_DELETED, } from '../../events/conversation.events.js';
import { CONVERSATION_PRESENCE, PRESENCE_CHANGED, } from '../../events/presence.events.js';
import { CONVERSATION_TYPING, TYPING_SIGNAL, } from '../../events/typing.events.js';
import { MESSAGES_READ, MESSAGE_CREATED, } from '../../events/message.events.js';
import { TokensService } from '../../modules/tokens/index.js';
import { PresenceService } from '../presence/index.js';
const OFFLINE_GRACE_MS = 8_000;
let SocketProvider = SocketProvider_1 = class SocketProvider {
    tokensService;
    presence;
    eventEmitter;
    server;
    logger = new Logger(SocketProvider_1.name);
    offlineTimers = new Map();
    constructor(tokensService, presence, eventEmitter) {
        this.tokensService = tokensService;
        this.presence = presence;
        this.eventEmitter = eventEmitter;
    }
    syncPresence(userId, wasOnline) {
        const isOnline = this.presence.isOnline(userId);
        if (isOnline === wasOnline)
            return;
        if (isOnline) {
            const pending = this.offlineTimers.get(userId);
            if (pending) {
                clearTimeout(pending);
                this.offlineTimers.delete(userId);
            }
            this.eventEmitter.emit(PRESENCE_CHANGED, {
                userId,
                online: true,
            });
            return;
        }
        const timer = setTimeout(() => {
            this.offlineTimers.delete(userId);
            if (!this.presence.isOnline(userId)) {
                this.eventEmitter.emit(PRESENCE_CHANGED, {
                    userId,
                    online: false,
                });
            }
        }, OFFLINE_GRACE_MS);
        this.offlineTimers.set(userId, timer);
    }
    afterInit(server) {
        this.server = server;
        this.logger.log('🚀 Socket.IO gateway inicializado en /ws');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token) {
                client.emit('error', { message: 'Token requerido' });
                client.disconnect();
                return;
            }
            const payload = await this.tokensService.verifySocketToken(token);
            if (!payload?.sub) {
                throw new UnauthorizedException('Token inválido');
            }
            client.data = { userId: payload.sub, sessionId: payload.session_id };
            const userRoom = `user:${payload.sub}`;
            await client.join(userRoom);
            if (payload.session_id) {
                await client.join(`session:${payload.sub}:${payload.session_id}`);
            }
            const wasOnline = this.presence.isOnline(payload.sub);
            this.presence.connect(payload.sub, client.id);
            this.syncPresence(payload.sub, wasOnline);
            client.emit('authenticated', { userId: payload.sub, rooms: [userRoom] });
            this.logger.log(`✅ Socket autenticado: ${client.id} | user ${payload.sub}`);
        }
        catch {
            this.logger.warn(`❌ Autenticación de socket fallida: ${client.id}`);
            client.emit('error', {
                message: 'Autenticación fallida',
                code: 'AUTH_FAILED',
            });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.userId;
        if (userId) {
            const wasOnline = this.presence.isOnline(userId);
            this.presence.disconnect(userId, client.id);
            this.syncPresence(userId, wasOnline);
        }
        this.logger.log(`🔴 Socket desconectado: ${client.id}${userId ? ` | user ${userId}` : ''}`);
    }
    handlePresenceAway(client) {
        const userId = client.data?.userId;
        if (!userId)
            return;
        const wasOnline = this.presence.isOnline(userId);
        this.presence.setAway(userId, client.id, true);
        this.syncPresence(userId, wasOnline);
    }
    handlePresenceActive(client) {
        const userId = client.data?.userId;
        if (!userId)
            return;
        const wasOnline = this.presence.isOnline(userId);
        this.presence.setAway(userId, client.id, false);
        this.syncPresence(userId, wasOnline);
    }
    handleTypingStart(client, payload) {
        this.emitTypingSignal(client, payload?.conversationId, true);
    }
    handleTypingStop(client, payload) {
        this.emitTypingSignal(client, payload?.conversationId, false);
    }
    emitTypingSignal(client, conversationId, typing) {
        const userId = client.data?.userId;
        if (!userId || !conversationId)
            return;
        this.eventEmitter.emit(TYPING_SIGNAL, {
            senderId: userId,
            conversationId,
            typing,
        });
    }
    handleJoinRoom(client, roomId) {
        void client.join(roomId);
        client.emit('room-joined', { roomId });
    }
    handleLeaveRoom(client, roomId) {
        void client.leave(roomId);
        client.emit('room-left', { roomId });
    }
    emitToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
    emitToRoom(room, event, payload) {
        this.server.to(room).emit(event, payload);
    }
    handleCounterpartUpdated(payload) {
        this.emitToUser(payload.targetUserId, 'conversation:updated', {
            conversationId: payload.conversationId,
            counterpart: payload.counterpart,
        });
    }
    handleConversationCreated(payload) {
        this.emitToUser(payload.targetUserId, 'conversation:new', payload.item);
    }
    handleConversationDeleted(payload) {
        this.emitToUser(payload.targetUserId, 'conversation:deleted', {
            conversationId: payload.conversationId,
        });
    }
    handleConversationPresence(payload) {
        this.emitToUser(payload.targetUserId, 'presence:changed', {
            conversationId: payload.conversationId,
            online: payload.online,
        });
    }
    handleConversationTyping(payload) {
        this.emitToUser(payload.targetUserId, 'typing:changed', {
            conversationId: payload.conversationId,
            typing: payload.typing,
        });
    }
    handleMessageCreated(payload) {
        this.emitToUser(payload.targetUserId, 'message:new', {
            conversationId: payload.conversationId,
            message: payload.message,
        });
    }
    handleMessagesRead(payload) {
        this.emitToUser(payload.targetUserId, 'message:read', {
            conversationId: payload.conversationId,
            readAt: payload.readAt,
        });
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], SocketProvider.prototype, "server", void 0);
__decorate([
    SubscribeMessage('presence:away'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handlePresenceAway", null);
__decorate([
    SubscribeMessage('presence:active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handlePresenceActive", null);
__decorate([
    SubscribeMessage('typing:start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleTypingStart", null);
__decorate([
    SubscribeMessage('typing:stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleTypingStop", null);
__decorate([
    SubscribeMessage('join-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, String]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleJoinRoom", null);
__decorate([
    SubscribeMessage('leave-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, String]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleLeaveRoom", null);
__decorate([
    OnEvent(CONVERSATION_COUNTERPART_UPDATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleCounterpartUpdated", null);
__decorate([
    OnEvent(CONVERSATION_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleConversationCreated", null);
__decorate([
    OnEvent(CONVERSATION_DELETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleConversationDeleted", null);
__decorate([
    OnEvent(CONVERSATION_PRESENCE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleConversationPresence", null);
__decorate([
    OnEvent(CONVERSATION_TYPING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleConversationTyping", null);
__decorate([
    OnEvent(MESSAGE_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleMessageCreated", null);
__decorate([
    OnEvent(MESSAGES_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketProvider.prototype, "handleMessagesRead", null);
SocketProvider = SocketProvider_1 = __decorate([
    WebSocketGateway({
        path: '/ws',
        cors: { origin: '*' },
        transports: ['websocket', 'polling'],
        connectionStateRecovery: { maxDisconnectionDuration: 120_000 },
    }),
    __metadata("design:paramtypes", [TokensService,
        PresenceService,
        EventEmitter2])
], SocketProvider);
export { SocketProvider };
//# sourceMappingURL=socket.provider.js.map