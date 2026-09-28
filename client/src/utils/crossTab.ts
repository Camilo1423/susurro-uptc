import type { AuthUser, ChatMessage } from "@Types";

/**
 * Sincronización entre PESTAÑAS del mismo navegador vía BroadcastChannel. Cubre
 * las acciones propias del usuario que el socket no replica a sus otras pestañas:
 * - mensajes que YO envío (el socket solo los manda a la contraparte),
 * - cambios de mi perfil (nombre/datos y foto), hechos por HTTP.
 *
 * El emisor NO recibe su propio mensaje (comportamiento de BroadcastChannel), así
 * que no hay eco en la pestaña que originó el cambio.
 */
export type CrossTabEvent =
  | { type: "session-set"; user: AuthUser }
  | { type: "session-patch"; patch: Partial<AuthUser> }
  | { type: "message"; conversationId: string; message: ChatMessage };

const CHANNEL_NAME = "susurro-cross-tab";

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  channel ??= new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

/** Publica un evento a las demás pestañas. */
export function postCrossTab(event: CrossTabEvent): void {
  getChannel()?.postMessage(event);
}

/** Se suscribe a los eventos de otras pestañas. Devuelve la función para cancelar. */
export function subscribeCrossTab(
  handler: (event: CrossTabEvent) => void,
): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const listener = (ev: MessageEvent) => handler(ev.data as CrossTabEvent);
  ch.addEventListener("message", listener);
  return () => ch.removeEventListener("message", listener);
}
