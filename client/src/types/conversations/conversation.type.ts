/** Item de la lista de chats (espeja lo que devuelve `GET /api/v1/conversations`). */
export interface ConversationListItem {
  conversationId: string;
  /** `true` si el otro participante se muestra anónimo. */
  isAnonymous: boolean;
  /** Alias del sistema si el otro está anónimo, o su nombre completo si no. */
  displayName: string;
  /** Ruta del thumbnail del otro (solo si NO está anónimo). */
  avatar: string | null;
  /** Último mensaje de la conversación (o null si no hay). Fechas como string (JSON). */
  lastMessage: {
    content: string;
    createdAt: string;
    fromMe: boolean;
    /** Confirmación de lectura del último mensaje (para el check en la card). */
    readAt: string | null;
  } | null;
  unreadCount: number;
  lastActivityAt: string;
  /** `true` si la contraparte está conectada y activa ahora (punto verde). */
  online: boolean;
}

/** Payload del socket `presence:changed` (presencia de una contraparte). */
export interface ConversationPresence {
  conversationId: string;
  online: boolean;
}

/** Resultado de iniciar una conversación por PIN. */
export interface CreateConversationResult {
  conversationId: string;
  /** `true` si se creó ahora; `false` si ya existía. */
  created: boolean;
}

/** Resultado de un chat aleatorio. */
export interface RandomChatResult extends CreateConversationResult {
  /** `true` si la persona elegida probablemente no esté en línea. */
  warnOffline: boolean;
}

/** Payload del socket `conversation:updated` (la contraparte cambió su anonimidad). */
export interface ConversationCounterpartUpdate {
  conversationId: string;
  counterpart: {
    isAnonymous: boolean;
    displayName: string;
    avatarThumbnail: string | null;
    avatarOriginal: string | null;
  };
}

/** Payload del socket `conversation:deleted` (un participante eliminó el chat). */
export interface ConversationDeleted {
  conversationId: string;
}

/** Un mensaje del chat (fromMe relativo a quien lo ve). Fechas como string (JSON). */
export interface ChatMessage {
  id: string;
  content: string;
  fromMe: boolean;
  createdAt: string;
  /** Confirmación de lectura: != null → check amarillo. */
  readAt: string | null;
  /** Mensaje citado si es una respuesta, o null. */
  replyTo: { id: string; content: string; fromMe: boolean } | null;
}

/** Página del historial de mensajes. */
export interface MessagesPage {
  messages: ChatMessage[];
  hasMore: boolean;
}

/** Payload del socket `message:new`. */
export interface MessageNew {
  conversationId: string;
  message: ChatMessage;
}

/** Payload del socket `message:read` (mis mensajes fueron leídos). */
export interface MessagesRead {
  conversationId: string;
  readAt: string;
}

/** Detalle de un chat (para la vista de información). */
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
  createdAt: string;
  lastActivityAt: string | null;
}
