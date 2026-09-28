import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { type ProfileUpdatedEvent } from '../shared/events/profile.events.js';
import { type PresenceChangedEvent } from '../shared/events/presence.events.js';
import { type TypingSignalEvent } from '../shared/events/typing.events.js';
import { type MessageItemView } from '../shared/events/message.events.js';
import { PresenceService } from '../shared/providers/presence/index.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
export interface MessagesPage {
    messages: MessageItemView[];
    hasMore: boolean;
}
export interface ChatListItem {
    conversationId: string;
    isAnonymous: boolean;
    displayName: string;
    avatar: string | null;
    lastMessage: {
        content: string;
        createdAt: Date;
        fromMe: boolean;
        readAt: Date | null;
    } | null;
    unreadCount: number;
    lastActivityAt: Date;
    online: boolean;
}
export interface CreatedConversation {
    conversationId: string;
    created: boolean;
}
export interface RandomConversation extends CreatedConversation {
    warnOffline: boolean;
}
export interface ChatDetail {
    conversationId: string;
    counterpart: {
        isAnonymous: boolean;
        displayName: string;
        avatar: string | null;
    };
    me: {
        isAnonymous: boolean;
        alias: string;
    };
    createdAt: Date;
    lastActivityAt: Date | null;
}
export declare class ConversationsService {
    private readonly prisma;
    private readonly eventEmitter;
    private readonly presence;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2, presence: PresenceService);
    private avatarPath;
    createByPin(userId: string, dto: CreateConversationDto): Promise<CreatedConversation>;
    private _startConversation;
    startRandom(userId: string): Promise<RandomConversation>;
    private _findForParticipant;
    private buildCounterpartView;
    private buildListItem;
    private buildDetail;
    getDetail(userId: string, conversationId: string): Promise<ChatDetail>;
    setMyAnonymity(userId: string, conversationId: string, anonymous: boolean): Promise<ChatDetail>;
    deleteConversation(userId: string, conversationId: string): Promise<void>;
    private _assertParticipant;
    private buildMessageView;
    sendMessage(userId: string, conversationId: string, dto: CreateMessageDto): Promise<MessageItemView>;
    listMessages(userId: string, conversationId: string, before?: string, limit?: number): Promise<MessagesPage>;
    markRead(userId: string, conversationId: string): Promise<{
        readAt: Date | null;
    }>;
    listForUser(userId: string): Promise<ChatListItem[]>;
    broadcastProfileUpdate(userId: string): Promise<void>;
    handleProfileUpdated(event: ProfileUpdatedEvent): void;
    broadcastPresence(userId: string, online: boolean): Promise<void>;
    handlePresenceChanged(event: PresenceChangedEvent): void;
    private forwardTyping;
    handleTypingSignal(event: TypingSignalEvent): void;
}
