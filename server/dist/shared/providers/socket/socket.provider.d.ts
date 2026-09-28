import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { type ConversationCounterpartUpdatedEvent, type ConversationCreatedEvent, type ConversationDeletedEvent } from '../../events/conversation.events.js';
import { type ConversationPresenceEvent } from '../../events/presence.events.js';
import { type ConversationTypingEvent } from '../../events/typing.events.js';
import { type MessageCreatedEvent, type MessagesReadEvent } from '../../events/message.events.js';
import { TokensService } from '../../modules/tokens/index.js';
import { PresenceService } from '../presence/index.js';
export declare class SocketProvider implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly tokensService;
    private readonly presence;
    private readonly eventEmitter;
    private server;
    private readonly logger;
    private readonly offlineTimers;
    constructor(tokensService: TokensService, presence: PresenceService, eventEmitter: EventEmitter2);
    private syncPresence;
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handlePresenceAway(client: Socket): void;
    handlePresenceActive(client: Socket): void;
    handleTypingStart(client: Socket, payload: {
        conversationId?: string;
    }): void;
    handleTypingStop(client: Socket, payload: {
        conversationId?: string;
    }): void;
    private emitTypingSignal;
    handleJoinRoom(client: Socket, roomId: string): void;
    handleLeaveRoom(client: Socket, roomId: string): void;
    emitToUser(userId: string, event: string, payload: unknown): void;
    emitToRoom(room: string, event: string, payload: unknown): void;
    handleCounterpartUpdated(payload: ConversationCounterpartUpdatedEvent): void;
    handleConversationCreated(payload: ConversationCreatedEvent): void;
    handleConversationDeleted(payload: ConversationDeletedEvent): void;
    handleConversationPresence(payload: ConversationPresenceEvent): void;
    handleConversationTyping(payload: ConversationTypingEvent): void;
    handleMessageCreated(payload: MessageCreatedEvent): void;
    handleMessagesRead(payload: MessagesReadEvent): void;
}
