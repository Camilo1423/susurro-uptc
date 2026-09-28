import type { ChatMessage } from "@Types";
import { CheckCheck, CornerUpLeft } from "lucide-react";

/** Hora corta (hh:mm) del mensaje. */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Botón "responder" que aparece al hacer hover sobre la burbuja. */
function ReplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Responder"
      aria-label="Responder"
      className="mb-1 grid size-7 shrink-0 place-items-center rounded-full text-neutral-400 opacity-0 transition-all hover:bg-neutral-100 hover:text-uptc-gold group-hover:opacity-100 dark:hover:bg-white/10"
    >
      <CornerUpLeft className="size-4" />
    </button>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  /** Nombre a mostrar de la contraparte (para la cita de respuesta). */
  counterpartName: string;
  onReply: (message: ChatMessage) => void;
}

/** Burbuja de un mensaje: mías (dorado) a la derecha, recibidas a la izquierda. */
export default function MessageBubble({
  message,
  counterpartName,
  onReply,
}: MessageBubbleProps) {
  const mine = message.fromMe;

  return (
    <div
      className={`group flex items-end gap-1.5 ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      {mine ? <ReplyButton onClick={() => onReply(message)} /> : null}

      <div
        className={`relative max-w-[75%] rounded-2xl px-3.5 py-2 shadow-sm ${
          mine
            ? "rounded-br-md bg-uptc-gold-soft text-uptc-carbon dark:bg-uptc-gold/15 dark:text-neutral-50"
            : "rounded-bl-md bg-white text-uptc-carbon dark:bg-uptc-graphite dark:text-neutral-100"
        }`}
      >
        {/* Cita del mensaje respondido */}
        {message.replyTo ? (
          <div
            className={`mb-1.5 rounded-lg border-l-2 px-2 py-1 ${
              mine
                ? "border-uptc-gold bg-black/[0.04] dark:bg-black/20"
                : "border-uptc-gold bg-uptc-gold/10"
            }`}
          >
            <p className="text-[11px] font-semibold text-uptc-gold-light">
              {message.replyTo.fromMe ? "Tú" : counterpartName}
            </p>
            <p className="truncate text-xs opacity-70">
              {message.replyTo.content}
            </p>
          </div>
        ) : null}

        <p className="whitespace-pre-wrap break-words text-sm">
          {message.content}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            mine ? "text-uptc-carbon/60 dark:text-neutral-400" : "text-neutral-400"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {/* Confirmación de lectura (doble check): gris = enviado, amarillo = leído */}
          {mine ? (
            <CheckCheck
              className={`size-3.5 ${
                message.readAt ? "text-amber-500" : "text-neutral-400"
              }`}
            />
          ) : null}
        </div>
      </div>

      {!mine ? <ReplyButton onClick={() => onReply(message)} /> : null}
    </div>
  );
}
