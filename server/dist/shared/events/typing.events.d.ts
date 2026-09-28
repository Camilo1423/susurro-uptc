export declare const TYPING_SIGNAL = "typing.signal";
export interface TypingSignalEvent {
    senderId: string;
    conversationId: string;
    typing: boolean;
}
export declare const CONVERSATION_TYPING = "conversation.typing";
export interface ConversationTypingEvent {
    targetUserId: string;
    conversationId: string;
    typing: boolean;
}
