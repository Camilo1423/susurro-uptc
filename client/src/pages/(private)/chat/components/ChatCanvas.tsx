import { LogoColor, LogoWhite } from "@Assets/index";
import { USE_CASES_TYPES } from "@Container";
import { useInjection, useSocket } from "@Hooks";
import type {
  ChatMessage,
  ConversationListItem,
  MessageNew,
  MessagesRead,
} from "@Types";
import type {
  GetChatMessagesUseCase,
  MarkChatReadUseCase,
  SendChatMessageUseCase,
} from "@UseCase";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MessagesSquare,
  Send,
  ShieldCheck,
  Smile,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { postCrossTab, subscribeCrossTab } from "@Utils";
import { useTheme } from "../../../../context/ThemeContext";
import { dayKey, dayLabel } from "../time";
import EmojiPicker from "./EmojiPicker";
import MessageBubble from "./MessageBubble";
import TypingDots from "./TypingDots";

interface ChatCanvasProps {
  conversation: ConversationListItem | null;
  onOpenInfo: () => void;
  /** Cierra el chat abierto (vuelve a la bienvenida). Se dispara con Escape. */
  onClose: () => void;
  /** `true` si la contraparte de este chat está escribiendo ahora. */
  counterpartTyping: boolean;
  /** Avisa a la lista que envié un mensaje (para actualizar preview/orden). */
  onMessageSent: (conversationId: string, message: ChatMessage) => void;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** Píldora de característica en la bienvenida. */
function FeaturePill({
  icon: Icon,
  children,
}: {
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-uptc-gold/25 bg-uptc-gold/[0.07] px-3.5 py-1.5 text-xs font-semibold text-uptc-carbon dark:text-uptc-gold-light">
      <Icon className="size-3.5 text-uptc-gold" />
      {children}
    </span>
  );
}

/** "Bandera" de fecha entre mensajes (Hoy / Ayer / fecha). */
function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-full bg-neutral-200/70 px-3 py-1 text-[11px] font-semibold text-neutral-500 backdrop-blur-sm dark:bg-white/10 dark:text-neutral-300">
        {label}
      </span>
    </div>
  );
}

/** Intervalo mínimo entre avisos de "escribiendo" al servidor (throttle). */
const TYPING_THROTTLE_MS = 1500;

export default function ChatCanvas({
  conversation,
  onOpenInfo,
  onClose,
  counterpartTyping,
  onMessageSent,
}: ChatCanvasProps) {
  const [imgError, setImgError] = useState(false);
  const { emit, on } = useSocket();
  const { theme } = useTheme();
  const conversationId = conversation?.conversationId ?? null;

  const getMessages = useInjection<GetChatMessagesUseCase>(
    USE_CASES_TYPES._GetChatMessages,
  );
  const sendMessage = useInjection<SendChatMessageUseCase>(
    USE_CASES_TYPES._SendChatMessage,
  );
  const markRead = useInjection<MarkChatReadUseCase>(
    USE_CASES_TYPES._MarkChatRead,
  );

  const [draft, setDraft] = useState("");
  const lastTypingEmit = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiOpenRef = useRef(false);
  emojiOpenRef.current = emojiOpen;

  /** Ajusta la altura del textarea al contenido (hasta un máximo). */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, []);

  // Reajusta la altura cuando cambia el borrador (escribir, insertar emoji, enviar).
  useLayoutEffect(() => {
    autoResize();
  }, [draft, autoResize]);

  /** Inserta un emoji en la posición del cursor del textarea. */
  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setDraft((d) => d + emoji);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    setDraft(draft.slice(0, start) + emoji + draft.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);
  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Escape cierra el chat abierto (única forma de cerrarlo).
  useEffect(() => {
    if (!conversationId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Escape cierra primero el selector de emojis; si no, cierra el chat.
      if (emojiOpenRef.current) {
        setEmojiOpen(false);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [conversationId, onClose]);

  // Al cambiar de conversación: limpia borrador/cita, carga historial y marca
  // como leído (leído al abrir). Avisa "dejé de escribir" al salir.
  useEffect(() => {
    if (!conversationId) return;
    let alive = true;
    setDraft("");
    setReplyTo(null);
    setMessages([]);
    setLoadingMsgs(true);
    setEmojiOpen(false);
    lastTypingEmit.current = 0;

    getMessages
      .execute(conversationId)
      .then((page) => {
        if (!alive) return;
        setMessages(page.messages);
        setHasMore(page.hasMore);
        setLoadingMsgs(false);
        void markRead.execute(conversationId);
      })
      .catch(() => alive && setLoadingMsgs(false));

    return () => {
      alive = false;
      emit("typing:stop", { conversationId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Autoscroll al fondo cuando llegan/creo mensajes (no al precargar anteriores).
  useLayoutEffect(() => {
    if (autoScrollRef.current) scrollToBottom();
    autoScrollRef.current = true;
  }, [messages, scrollToBottom]);

  // Tiempo real: mensajes nuevos y confirmaciones de lectura de ESTA conversación.
  useEffect(() => {
    if (!conversationId) return;
    const offNew = on("message:new", (raw: unknown) => {
      const p = raw as MessageNew;
      if (p.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.some((m) => m.id === p.message.id) ? prev : [...prev, p.message],
      );
      // El "marcar leído al llegar" lo decide el padre (Chat.tsx) según el chat
      // realmente abierto; aquí solo agregamos el mensaje al hilo.
    });
    const offRead = on("message:read", (raw: unknown) => {
      const p = raw as MessagesRead;
      if (p.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.fromMe && !m.readAt ? { ...m, readAt: p.readAt } : m,
        ),
      );
    });
    return () => {
      offNew();
      offRead();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, on]);

  // Multi-pestaña: un mensaje que envié en OTRA pestaña → agrégalo a este hilo.
  useEffect(() => {
    if (!conversationId) return;
    return subscribeCrossTab((event) => {
      if (event.type !== "message" || event.conversationId !== conversationId) {
        return;
      }
      setMessages((prev) =>
        prev.some((m) => m.id === event.message.id)
          ? prev
          : [...prev, event.message],
      );
    });
  }, [conversationId]);

  const onDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDraft(value);
    if (!conversationId || !value.trim()) return;
    const now = Date.now();
    if (now - lastTypingEmit.current > TYPING_THROTTLE_MS) {
      emit("typing:start", { conversationId });
      lastTypingEmit.current = now;
    }
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId || sending) return;
    setSending(true);
    const replyId = replyTo?.id;
    try {
      const msg = await sendMessage.execute(conversationId, content, replyId);
      setMessages((prev) => [...prev, msg]);
      setDraft("");
      setReplyTo(null);
      setEmojiOpen(false);
      emit("typing:stop", { conversationId });
      lastTypingEmit.current = 0;
      onMessageSent(conversationId, msg);
      // Replica el mensaje a mis otras pestañas (el socket solo lo manda a la
      // contraparte, no a mí mismo).
      postCrossTab({ type: "message", conversationId, message: msg });
    } catch {
      /* el error ya se loguea en el caso de uso */
    } finally {
      setSending(false);
    }
  };

  const loadMore = async () => {
    if (!conversationId || loadingMore || messages.length === 0) return;
    setLoadingMore(true);
    autoScrollRef.current = false; // no saltar al fondo al precargar anteriores
    try {
      const page = await getMessages.execute(conversationId, {
        before: messages[0].id,
      });
      setMessages((prev) => [...page.messages, ...prev]);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  };

  // Entrada/salida del "escribiendo…": se mantiene montado durante la salida
  // para desvanecerse con la misma fluidez con la que entró (espejo de fade-up).
  const [showTyping, setShowTyping] = useState(false);
  const [typingLeaving, setTypingLeaving] = useState(false);
  useEffect(() => {
    if (counterpartTyping) {
      setTypingLeaving(false);
      setShowTyping(true);
      return;
    }
    if (!showTyping) return;
    setTypingLeaving(true);
    const t = setTimeout(() => {
      setShowTyping(false);
      setTypingLeaving(false);
    }, 200); // coincide con la duración de animate-typing-out
    return () => clearTimeout(t);
  }, [counterpartTyping, showTyping]);

  if (!conversation) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-7 p-8 text-center">
        {/* Logo con halo dorado */}
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-uptc-gold/25 blur-3xl" />
          <img
            src={theme === "light" ? LogoColor : LogoWhite}
            alt="UPTC"
            className="h-20 w-auto"
          />
        </div>

        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-uptc-carbon dark:text-white">
            Bienvenido a <span className="text-uptc-gold">Susurro</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Conecta con personas de la comunidad y habla libremente, sin miedo a
            ser juzgado. Lánzate a un chat al azar, comparte tu PIN para que te
            encuentren, o abre una conversación de la izquierda.
          </p>
        </div>

        {/* Características */}
        <div className="flex max-w-md animate-fade-up-slow flex-wrap items-center justify-center gap-2">
          <FeaturePill icon={ShieldCheck}>Sin juicios</FeaturePill>
          <FeaturePill icon={Users}>Conoce desconocidos</FeaturePill>
          <FeaturePill icon={KeyRound}>Anónimo si quieres</FeaturePill>
        </div>

        <div className="divider-gold mt-1" />
      </main>
    );
  }

  const showImg = Boolean(conversation.avatar) && !imgError;
  const anon = conversation.isAnonymous;
  const canSend = draft.trim().length > 0 && !sending;

  return (
    <main className="flex flex-1 flex-col">
      {/* Cabecera glass de la conversación (click → info del chat) */}
      <header className="flex items-center border-b border-neutral-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-uptc-graphite/60">
        {/* Atrás (solo móvil): vuelve a la lista */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver a la lista"
          className="ml-2 grid size-10 shrink-0 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 md:hidden dark:text-neutral-400 dark:hover:bg-white/5"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={onOpenInfo}
          title="Ver información del chat"
          className="group flex flex-1 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50/60 md:px-6 dark:hover:bg-white/[0.03]"
        >
          <span className="relative shrink-0">
            <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-uptc-gold/25 to-uptc-gold/5 text-sm font-bold text-uptc-carbon ring-2 ring-transparent transition-all group-hover:ring-uptc-gold/30 dark:text-uptc-gold-light">
              {showImg ? (
                <img
                  src={conversation.avatar ?? undefined}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                initialsOf(conversation.displayName)
              )}
            </span>
            <span
              title={conversation.online ? "En línea" : "Desconectado"}
              className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white transition-colors dark:border-uptc-graphite ${
                conversation.online
                  ? "bg-emerald-500"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display font-bold text-uptc-carbon dark:text-white">
              {conversation.displayName}
            </span>
            <span
              className={`mt-0.5 inline-flex items-center gap-1 text-xs ${
                counterpartTyping
                  ? "text-emerald-500"
                  : anon
                    ? "text-neutral-400"
                    : "text-uptc-gold dark:text-uptc-gold-light"
              }`}
            >
              {counterpartTyping ? (
                <>
                  <TypingDots /> escribiendo…
                </>
              ) : anon ? (
                <>
                  <EyeOff className="size-3" /> En modo anónimo
                </>
              ) : (
                <>
                  <Eye className="size-3" /> Identidad visible
                </>
              )}
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-uptc-gold dark:text-neutral-600" />
        </button>
      </header>

      {/* Área de mensajes */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col overflow-y-auto px-3 py-4 md:px-6 md:py-6"
      >
        {loadingMsgs ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-uptc-gold" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-uptc-gold/20 to-uptc-gold/5 text-uptc-gold-light">
              <MessagesSquare className="size-8" />
            </span>
            <div>
              <p className="font-display font-bold text-uptc-carbon dark:text-white">
                Aún no hay mensajes
              </p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
                Escríbele a{" "}
                <span className="font-semibold text-uptc-carbon dark:text-neutral-200">
                  {conversation.displayName}
                </span>{" "}
                para empezar la conversación.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-uptc-gold/25 bg-uptc-gold/[0.07] px-3 py-1 text-xs font-medium text-uptc-carbon dark:text-uptc-gold-light">
              <ShieldCheck className="size-3.5 text-uptc-gold" />
              Conversación privada
            </span>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-1.5">
            {hasMore ? (
              <div className="mb-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-200 disabled:opacity-60 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10"
                >
                  {loadingMore ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                  Ver mensajes anteriores
                </button>
              </div>
            ) : null}

            {(() => {
              const nodes: React.ReactNode[] = [];
              let prevKey: string | null = null;
              for (const m of messages) {
                const key = dayKey(m.createdAt);
                if (key !== prevKey) {
                  nodes.push(
                    <DateSeparator
                      key={`sep-${m.id}`}
                      label={dayLabel(m.createdAt)}
                    />,
                  );
                  prevKey = key;
                }
                nodes.push(
                  <MessageBubble
                    key={m.id}
                    message={m}
                    counterpartName={conversation.displayName}
                    onReply={setReplyTo}
                  />,
                );
              }
              return nodes;
            })()}
          </div>
        )}

        {/* Burbuja "escribiendo…" (como un mensaje recibido) */}
        {showTyping ? (
          <div
            className={`flex items-end gap-2 pt-3 ${
              typingLeaving ? "animate-typing-out" : "animate-typing-in"
            }`}
          >
            <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-uptc-gold/25 to-uptc-gold/5 text-[11px] font-bold text-uptc-carbon dark:text-uptc-gold-light">
              {showImg ? (
                <img
                  src={conversation.avatar ?? undefined}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                initialsOf(conversation.displayName)
              )}
            </span>
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft dark:bg-uptc-graphite">
              <TypingDots className="text-neutral-400 dark:text-neutral-500" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Compositor */}
      <div className="border-t border-neutral-200/60 bg-white/70 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-uptc-graphite/60">
        {/* Barra de respuesta */}
        {replyTo ? (
          <div className="mb-2 flex items-start gap-2 rounded-xl border-l-2 border-uptc-gold bg-uptc-gold/10 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-uptc-gold-light">
                Respondiendo a{" "}
                {replyTo.fromMe ? "ti mismo" : conversation.displayName}
              </p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {replyTo.content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              aria-label="Cancelar respuesta"
              className="grid size-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          {/* Botón de emojis + su popover */}
          <div className="relative shrink-0">
            {emojiOpen ? (
              <EmojiPicker
                onSelect={insertEmoji}
                onClose={() => setEmojiOpen(false)}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setEmojiOpen((v) => !v)}
              aria-label="Emojis"
              title="Emojis"
              className={`grid size-12 place-items-center rounded-full transition-colors ${
                emojiOpen
                  ? "bg-uptc-gold/15 text-uptc-gold"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-uptc-gold dark:hover:bg-white/10"
              }`}
            >
              <Smile className="size-5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={onDraftChange}
            onKeyDown={(e) => {
              // Enter = salto de línea (formato). Ctrl/⌘+Enter = enviar.
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                void handleSend();
              }
            }}
            rows={1}
            placeholder="Escribe un mensaje..."
            className="max-h-[140px] flex-1 resize-none rounded-3xl border border-neutral-200 bg-neutral-100/70 px-5 py-3 text-sm text-uptc-carbon outline-none transition-all placeholder:text-neutral-400 focus:border-uptc-gold/40 focus:bg-white focus:ring-4 focus:ring-uptc-gold/15 dark:border-white/5 dark:bg-white/5 dark:text-neutral-200 dark:focus:bg-white/[0.07]"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend}
            aria-label="Enviar"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-uptc-gold text-uptc-carbon shadow-gold transition-all hover:bg-uptc-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </button>
        </div>

        {/* Pista de teclado (solo escritorio) */}
        <p className="mt-1.5 hidden pl-14 text-[10px] text-neutral-400 md:block">
          Enter para salto de línea · Ctrl/⌘ + Enter para enviar
        </p>
      </div>
    </main>
  );
}
