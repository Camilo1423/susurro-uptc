/** Mensaje del chat (dominio de ejemplo de anomChat). */
export interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CreateMessageRequest {
  content: string;
}
