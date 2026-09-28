export declare const CONVERSATION_COUNTERPART_UPDATED = "conversation.counterpart-updated";
export interface CounterpartView {
    isAnonymous: boolean;
    displayName: string;
    avatarThumbnail: string | null;
    avatarOriginal: string | null;
}
export interface ConversationCounterpartUpdatedEvent {
    targetUserId: string;
    conversationId: string;
    counterpart: CounterpartView;
}
export declare const CONVERSATION_CREATED = "conversation.created";
export interface ConversationListItemView {
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
export interface ConversationCreatedEvent {
    targetUserId: string;
    item: ConversationListItemView;
}
export declare const CONVERSATION_DELETED = "conversation.deleted";
export interface ConversationDeletedEvent {
    targetUserId: string;
    conversationId: string;
}
