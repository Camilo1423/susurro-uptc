/** Vista de un mensaje desde la perspectiva de quien lo recibe (`fromMe` relativo). */
export interface MessageItemView {
  id: string;
  content: string;
  /** `true` si lo envié yo (el que ve). */
  fromMe: boolean;
  createdAt: Date;
  /** Confirmación de lectura: != null → check amarillo. */
  readAt: Date | null;
  /** Mensaje citado (si es una respuesta), o null. */
  replyTo: { id: string; content: string; fromMe: boolean } | null;
}

/** Evento interno: se creó un mensaje; hay que empujárselo a la contraparte. */
export const MESSAGE_CREATED = 'message.created';

export interface MessageCreatedEvent {
  targetUserId: string;
  conversationId: string;
  /** Vista construida DESDE la perspectiva de la contraparte (fromMe=false). */
  message: MessageItemView;
}

/** Evento interno: la contraparte leyó mis mensajes → checks en amarillo. */
export const MESSAGES_READ = 'message.read';

export interface MessagesReadEvent {
  /** Remitente cuyos mensajes fueron leídos (debe poner sus checks amarillos). */
  targetUserId: string;
  conversationId: string;
  readAt: Date;
}
