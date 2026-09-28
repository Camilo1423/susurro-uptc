/** Nombre del evento interno cuando cambia la anonimidad de un participante. */
export const CONVERSATION_COUNTERPART_UPDATED =
  'conversation.counterpart-updated';

/** Cómo ve el destinatario a la contraparte tras el cambio. */
export interface CounterpartView {
  isAnonymous: boolean;
  displayName: string;
  avatarThumbnail: string | null;
  avatarOriginal: string | null;
}

/** Payload del evento: a quién notificar y cómo queda la contraparte para él. */
export interface ConversationCounterpartUpdatedEvent {
  /** Usuario que debe recibir la actualización (la contraparte del que cambió). */
  targetUserId: string;
  conversationId: string;
  counterpart: CounterpartView;
}

/** Nombre del evento interno cuando se crea una conversación nueva. */
export const CONVERSATION_CREATED = 'conversation.created';

/** Item de lista de chat visto por un participante (igual a `ChatListItem`). */
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

/** Payload del evento: a quién avisar del chat nuevo y el item listo para pintar. */
export interface ConversationCreatedEvent {
  /** Usuario que debe ver aparecer el chat (el dueño del PIN). */
  targetUserId: string;
  item: ConversationListItemView;
}

/** Nombre del evento interno cuando se elimina una conversación. */
export const CONVERSATION_DELETED = 'conversation.deleted';

/** Payload del evento: a quién avisar que el chat ya no existe. */
export interface ConversationDeletedEvent {
  /** Contraparte que debe quitar (y cerrar si lo tiene abierto) el chat. */
  targetUserId: string;
  conversationId: string;
}
