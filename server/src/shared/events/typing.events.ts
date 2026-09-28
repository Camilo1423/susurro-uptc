/** Señal cruda emitida por el gateway cuando un socket reporta que escribe. */
export const TYPING_SIGNAL = 'typing.signal';

export interface TypingSignalEvent {
  /** Quién está (o dejó de) escribir. */
  senderId: string;
  conversationId: string;
  /** `true` = escribiendo; `false` = dejó de escribir. */
  typing: boolean;
}

/**
 * Evento derivado: "la contraparte de ESTA conversación está escribiendo".
 * Se propaga por `conversationId` (no por userId) para no filtrar identidad.
 */
export const CONVERSATION_TYPING = 'conversation.typing';

export interface ConversationTypingEvent {
  /** Usuario que debe ver el "escribiendo…" (la contraparte). */
  targetUserId: string;
  conversationId: string;
  typing: boolean;
}
