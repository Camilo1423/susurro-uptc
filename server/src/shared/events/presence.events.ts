/** Evento interno: cambió el estado efectivo (online/offline) de un usuario. */
export const PRESENCE_CHANGED = 'presence.changed';

export interface PresenceChangedEvent {
  userId: string;
  online: boolean;
}

/**
 * Evento interno derivado: presencia de una contraparte EN UNA CONVERSACIÓN.
 * Se propaga por `conversationId` (no por userId) para no filtrar identidad ni
 * permitir correlacionar al mismo usuario entre chats (anonimato).
 */
export const CONVERSATION_PRESENCE = 'conversation.presence';

export interface ConversationPresenceEvent {
  /** Usuario que debe recibir la actualización (la contraparte). */
  targetUserId: string;
  conversationId: string;
  online: boolean;
}
