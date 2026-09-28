import { ThemeSwitcher } from "@Components";
import { useSession } from "@Hooks";
import { useAppSelector } from "@Redux";
import type { ConversationListItem } from "@Types";
import {
  CheckCheck,
  Dices,
  Loader2,
  LogOut,
  MessagesSquare,
  MessageSquarePlus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatActivity } from "../time";
import PinReveal from "./PinReveal";
import TypingDots from "./TypingDots";
import { LogoColor, LogoWhite } from "@Assets/index";
import { useTheme } from "../../../../context/ThemeContext";

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenProfile: () => void;
  onNewChat: () => void;
  /** Inicia un chat aleatorio (con alguien sin chat previo, prioriza en línea). */
  onRandomChat: () => void;
  /** `true` mientras se está buscando el usuario aleatorio. */
  randomLoading: boolean;
  pin: string;
  /** Conversaciones donde la contraparte está escribiendo ahora. */
  typingIds: Set<string>;
  /** Chat cuyo canvas está abierto (ahí ya se ve el "escribiendo", no en la card). */
  openChatId: string | null;
  /** En móvil, oculta el sidebar cuando hay un panel activo (chat/perfil/info). */
  mobileHidden: boolean;
}

/** Iniciales para el avatar de fallback a partir del nombre a mostrar. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** Panel izquierdo: identidad + PIN, búsqueda y lista de conversaciones. */
export default function ChatSidebar({
  conversations,
  loading,
  selectedId,
  onSelect,
  onOpenProfile,
  onNewChat,
  onRandomChat,
  randomLoading,
  pin,
  typingIds,
  openChatId,
  mobileHidden,
}: ChatSidebarProps) {
  const user = useAppSelector((state) => state.session.user);
  const { RemoveSession } = useSession();
  const [query, setQuery] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const { theme } = useTheme();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.firstLastName?.[0] ?? ""}`.toUpperCase()
    : "?";
  const thumb = user?.avatar?.thumbnail;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.displayName.toLowerCase().includes(q));
  }, [conversations, query]);

  const isEmpty = !loading && conversations.length === 0;

  return (
    <aside
      className={`relative z-10 h-full w-full shrink-0 flex-col border-r border-neutral-200/60 bg-white/80 backdrop-blur-xl md:w-80 md:flex dark:border-white/5 dark:bg-uptc-graphite/70 ${
        mobileHidden ? "hidden" : "flex"
      }`}
    >
      {/* Cabecera: logo + avatar (abre el perfil) */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <img
          src={theme === "light" ? LogoColor : LogoWhite}
          alt="UPTC"
          className="h-12 w-auto"
        />
        <button
          type="button"
          onClick={onOpenProfile}
          title="Mi perfil"
          aria-label="Abrir mi perfil"
          className="group relative grid size-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-uptc-gold/40 to-uptc-gold/10 text-sm font-bold text-uptc-carbon shadow-sm ring-2 ring-transparent transition-all hover:scale-105 hover:ring-uptc-gold/50 dark:text-uptc-gold-light"
        >
          {thumb && !avatarError ? (
            <img
              src={thumb}
              alt="Mi foto"
              className="size-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            initials
          )}
        </button>
      </div>

      {/* PIN de descubrimiento */}
      <div className="px-4 pb-3">
        <PinReveal pin={pin} />
      </div>

      {/* Búsqueda */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar chat..."
            className="w-full rounded-2xl border border-transparent bg-neutral-100/80 py-2.5 pl-10 pr-4 text-sm text-uptc-carbon outline-none transition-all placeholder:text-neutral-400 focus:border-uptc-gold/40 focus:bg-white focus:ring-4 focus:ring-uptc-gold/15 dark:bg-white/5 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-white/[0.07]"
          />
        </div>
      </div>

      {/* Iniciar chat por PIN + chat aleatorio */}
      {!isEmpty && (
        <div className="flex gap-2 px-4 pb-3">
          <button
            type="button"
            onClick={onNewChat}
            className="btn-gold flex flex-1 items-center justify-center gap-2"
          >
            <MessageSquarePlus className="size-4" />
            Iniciar chat
          </button>
          <button
            type="button"
            onClick={onRandomChat}
            disabled={randomLoading}
            title="Chat aleatorio"
            aria-label="Chat aleatorio"
            className="btn-outline flex items-center justify-center gap-2 px-3 disabled:opacity-60"
          >
            {randomLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Dices className="size-4" />
            )}
          </button>
        </div>
      )}

      {/* Separador sutil */}
      <div className="mx-4 mb-1 h-px bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent dark:via-white/10" />

      {/* Lista de conversaciones */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-1.5">
        {loading ? (
          <div className="space-y-1.5 px-1 py-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
              >
                <div className="size-11 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-white/5" />
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState
            onNewChat={onNewChat}
            onRandomChat={onRandomChat}
            randomLoading={randomLoading}
          />
        ) : filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-neutral-400">
            Sin resultados.
          </p>
        ) : (
          filtered.map((c) => (
            <ConversationRow
              key={c.conversationId}
              item={c}
              active={c.conversationId === selectedId}
              typing={
                typingIds.has(c.conversationId) &&
                c.conversationId !== openChatId
              }
              onSelect={() => onSelect(c.conversationId)}
            />
          ))
        )}
      </nav>

      {/* Pie: tema + cerrar sesión */}
      <div className="flex items-center justify-between gap-2 border-t border-neutral-200/60 px-4 py-3 dark:border-white/5">
        <ThemeSwitcher />
        <button
          type="button"
          onClick={() => void RemoveSession()}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="grid size-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </aside>
  );
}

/** Estado vacío: sin conversaciones. */
function EmptyState({
  onNewChat,
  onRandomChat,
  randomLoading,
}: {
  onNewChat: () => void;
  onRandomChat: () => void;
  randomLoading: boolean;
}) {
  return (
    <div className="flex animate-fade-up flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="relative grid size-16 place-items-center">
        <span className="absolute inset-0 animate-pulse rounded-full bg-uptc-gold/20 blur-lg" />
        <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-uptc-gold/25 to-uptc-gold/5 text-uptc-gold-light">
          <MessagesSquare className="size-7" />
        </span>
      </span>
      <p className="mt-1 text-sm font-bold text-uptc-carbon dark:text-white">
        No tienes conversaciones activas
      </p>
      <p className="max-w-[15rem] text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Activa una conversación ingresando el{" "}
        <span className="font-semibold text-uptc-gold">PIN</span> de tu amigo.
      </p>
      <button
        type="button"
        onClick={onNewChat}
        className="btn-gold mt-3 flex items-center gap-2"
      >
        <MessageSquarePlus className="size-4" />
        Iniciar chat
      </button>
      <button
        type="button"
        onClick={onRandomChat}
        disabled={randomLoading}
        className="btn-outline flex items-center gap-2 disabled:opacity-60"
      >
        {randomLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Dices className="size-4" />
        )}
        Chat aleatorio
      </button>
    </div>
  );
}

/** Fila de conversación en la lista. */
function ConversationRow({
  item,
  active,
  typing,
  onSelect,
}: {
  item: ConversationListItem;
  active: boolean;
  typing: boolean;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(item.avatar) && !imgError;
  const hasUnread = item.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-uptc-gold/15 via-uptc-gold/[0.06] to-transparent"
          : "hover:bg-neutral-100/70 dark:hover:bg-white/[0.04]"
      }`}
    >
      {/* Acento lateral cuando está activo */}
      {active ? (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-uptc-gold" />
      ) : null}

      {/* Avatar + indicador de anonimato */}
      <span className="relative shrink-0">
        <span
          className={`grid size-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-uptc-gold/25 to-uptc-gold/5 text-sm font-bold text-uptc-carbon ring-2 transition-all dark:text-uptc-gold-light ${
            active
              ? "ring-uptc-gold/50"
              : "ring-transparent group-hover:ring-uptc-gold/25"
          }`}
        >
          {showImg ? (
            <img
              src={item.avatar ?? undefined}
              alt=""
              className="size-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            initialsOf(item.displayName)
          )}
        </span>
        <span
          title={item.online ? "En línea" : "Desconectado"}
          className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white transition-colors dark:border-uptc-graphite ${
            item.online
              ? "bg-emerald-500"
              : "bg-neutral-300 dark:bg-neutral-600"
          }`}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm text-uptc-carbon dark:text-white ${
              hasUnread ? "font-bold" : "font-semibold"
            }`}
          >
            {item.displayName}
          </span>
          <span
            className={`shrink-0 text-[11px] ${
              hasUnread ? "font-semibold text-uptc-gold" : "text-neutral-400"
            }`}
          >
            {formatActivity(item.lastActivityAt)}
          </span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          {typing ? (
            <span className="flex items-center gap-1.5 truncate text-xs font-semibold text-emerald-500">
              <TypingDots />
              escribiendo…
            </span>
          ) : (
            <span
              className={`flex min-w-0 items-center gap-1 text-xs ${
                hasUnread
                  ? "font-medium text-neutral-600 dark:text-neutral-300"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {/* Estado de lectura del último mensaje (solo si es mío) */}
              {item.lastMessage?.fromMe ? (
                <CheckCheck
                  className={`size-3.5 shrink-0 ${
                    item.lastMessage.readAt
                      ? "text-amber-500"
                      : "text-neutral-400"
                  }`}
                />
              ) : null}
              <span className="truncate">
                {item.lastMessage ? item.lastMessage.content : "Sin mensajes aún"}
              </span>
            </span>
          )}
          {hasUnread ? (
            <span className="grid size-5 shrink-0 animate-pop place-items-center rounded-full bg-uptc-gold text-[11px] font-bold text-uptc-carbon shadow-gold">
              {item.unreadCount > 9 ? "9+" : item.unreadCount}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
