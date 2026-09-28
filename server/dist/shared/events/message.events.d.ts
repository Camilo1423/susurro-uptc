export interface MessageItemView {
    id: string;
    content: string;
    fromMe: boolean;
    createdAt: Date;
    readAt: Date | null;
    replyTo: {
        id: string;
        content: string;
        fromMe: boolean;
    } | null;
}
export declare const MESSAGE_CREATED = "message.created";
export interface MessageCreatedEvent {
    targetUserId: string;
    conversationId: string;
    message: MessageItemView;
}
export declare const MESSAGES_READ = "message.read";
export interface MessagesReadEvent {
    targetUserId: string;
    conversationId: string;
    readAt: Date;
}
