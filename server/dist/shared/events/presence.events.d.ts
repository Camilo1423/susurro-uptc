export declare const PRESENCE_CHANGED = "presence.changed";
export interface PresenceChangedEvent {
    userId: string;
    online: boolean;
}
export declare const CONVERSATION_PRESENCE = "conversation.presence";
export interface ConversationPresenceEvent {
    targetUserId: string;
    conversationId: string;
    online: boolean;
}
