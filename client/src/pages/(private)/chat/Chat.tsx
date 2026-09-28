import { USE_CASES_TYPES } from "@Container";
import { useInjection, useSocket } from "@Hooks";
import {
  setSession,
  updateSession,
  useAppDispatch,
  useAppSelector,
} from "@Redux";
import type {
  ChatMessage,
  ConversationCounterpartUpdate,
  ConversationListItem,
  MessageNew,
  MessagesRead,
} from "@Types";
import type {
  CreateConversationUseCase,
  GetConversationsUseCase,
  MarkChatReadUseCase,
  StartRandomChatUseCase,
} from "@UseCase";
import { subscribeCrossTab } from "@Utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatCanvas from "./components/ChatCanvas";
import ChatInfoPanel from "./components/ChatInfoPanel";
import ChatSidebar from "./components/ChatSidebar";
import NewChatModal from "./components/NewChatModal";
import ProfilePanel from "./components/ProfilePanel";
import { formatPin } from "./pin";

/** Qué se muestra en el panel derecho. */
type RightView = "chat" | "profile" | "info";

/**
 * Pantalla única de chat: lista de conversaciones (del backend) a la izquierda
 * y, a la derecha, la conversación, el perfil o la bienvenida.
 */
export default function Chat() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const pin = useMemo(() => (user?.pin ? formatPin(user.pin) : "----"), [user]);

  const getConversations = useInjection<GetConversationsUseCase>(
    USE_CASES_TYPES._GetConversations,
  );
  const createConversation = useInjection<CreateConversationUseCase>(
    USE_CASES_TYPES._CreateConversation,
  );
  const markChatRead = useInjection<MarkChatReadUseCase>(
    USE_CASES_TYPES._MarkChatRead,
  );
  const startRandomChat = useInjection<StartRandomChatUseCase>(
    USE_CASES_TYPES._StartRandomChat,
  );
  const { on, isConnected } = useSocket();
  const hasConnectedOnce = useRef(false);

  // null = cargando; [] = sin conversaciones.
  const [conversations, setConversations] = useState<
    ConversationListItem[] | null
  >(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rightView, setRightView] = useState<RightView>("chat");
  const [showNewChat, setShowNewChat] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  // Aviso transitorio (p. ej. "probablemente no esté en línea").
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Conversaciones donde la contraparte está "escribiendo…" ahora mismo.
  const [typingIds, setTypingIds] = useState<Set<string>>(() => new Set());
  const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Ref siempre al día del chat seleccionado (para handlers estables).
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  // Chat cuyo canvas está visible (para no contar no-leídos de un chat abierto).
  const openChatIdRef = useRef<string | null>(null);
  openChatIdRef.current = rightView === "chat" ? selectedId : null;

  /**
   * Quita un chat de la lista y, si es el que está abierto, cierra su vista.
   * Se usa tanto al eliminarlo yo como al recibir el evento de que lo eliminaron.
   */
  const removeConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev ? prev.filter((c) => c.conversationId !== id) : prev,
    );
    if (selectedIdRef.current === id) {
      setSelectedId(null);
      // Si estaba viendo su info, vuelve al canvas (bienvenida); si estaba en
      // el perfil, se queda ahí.
      setRightView((rv) => (rv === "info" ? "chat" : rv));
    }
  }, []);

  const loadConversations = useCallback(async () => {
    const list = await getConversations.execute();
    setConversations(list);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    getConversations
      .execute()
      .then((list) => alive && setConversations(list))
      .catch(() => alive && setConversations([]));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconciliación: al RE-conectar el socket (no la primera vez), vuelve a pedir
  // la lista por REST para recuperar lo que se haya perdido mientras estuvo caído.
  useEffect(() => {
    if (!isConnected) return;
    if (hasConnectedOnce.current) {
      void loadConversations();
    } else {
      hasConnectedOnce.current = true;
    }
  }, [isConnected, loadConversations]);

  // "Escribiendo…": muestra la animación y la auto-oculta 2 s después del último
  // aviso (si dejan de escribir, desaparece sola tras el delay).
  useEffect(() => {
    const removeTyping = (id: string) =>
      setTypingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

    const off = on("typing:changed", (raw: unknown) => {
      const p = raw as { conversationId: string; typing: boolean };
      const timers = typingTimers.current;
      const existing = timers.get(p.conversationId);
      if (existing) clearTimeout(existing);

      if (p.typing) {
        setTypingIds((prev) => {
          if (prev.has(p.conversationId)) return prev;
          const next = new Set(prev);
          next.add(p.conversationId);
          return next;
        });
        timers.set(
          p.conversationId,
          setTimeout(() => {
            timers.delete(p.conversationId);
            removeTyping(p.conversationId);
          }, 5000),
        );
      } else {
        timers.delete(p.conversationId);
        removeTyping(p.conversationId);
      }
    });
    return off;
  }, [on]);

  // Limpia timers de typing al desmontar.
  useEffect(() => {
    const timers = typingTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  /** Reordena la lista por actividad más reciente (desc). */
  const sortByActivity = (list: ConversationListItem[]) =>
    [...list].sort(
      (a, b) =>
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime(),
    );

  /** Actualiza el preview/orden de la lista con un mensaje (mío o recibido). */
  const applyMessageToList = useCallback(
    (conversationId: string, msg: ChatMessage, incoming: boolean) => {
      setConversations((prev) => {
        if (!prev) return prev;
        const isOpen = openChatIdRef.current === conversationId;
        const updated = prev.map((c) =>
          c.conversationId === conversationId
            ? {
                ...c,
                lastMessage: {
                  content: msg.content,
                  createdAt: msg.createdAt,
                  fromMe: !incoming,
                  readAt: msg.readAt,
                },
                lastActivityAt: msg.createdAt,
                // Solo suma no-leído si es entrante y el chat NO está abierto.
                unreadCount:
                  incoming && !isOpen
                    ? c.unreadCount + 1
                    : incoming
                      ? c.unreadCount
                      : c.unreadCount,
              }
            : c,
        );
        return sortByActivity(updated);
      });
    },
    [],
  );

  // Multi-pestaña (mismo navegador): replica MIS acciones a las otras pestañas.
  // - "message": un mensaje que envié en otra pestaña → actualiza lista (es mío).
  // - "session-set"/"session-patch": cambié mi perfil (datos/foto) en otra pestaña.
  useEffect(() => {
    return subscribeCrossTab((event) => {
      if (event.type === "message") {
        applyMessageToList(event.conversationId, event.message, false);
      } else if (event.type === "session-set") {
        dispatch(setSession(event.user));
      } else if (event.type === "session-patch") {
        dispatch(updateSession(event.patch));
      }
    });
  }, [applyMessageToList, dispatch]);

  // Mensaje entrante → actualiza la lista y, SOLO si ese chat está realmente
  // abierto, lo marca como leído (evita marcar leído con el chat cerrado).
  useEffect(() => {
    const off = on("message:new", (raw: unknown) => {
      const p = raw as MessageNew;
      applyMessageToList(p.conversationId, p.message, true);
      if (openChatIdRef.current === p.conversationId) {
        void markChatRead.execute(p.conversationId);
      }
    });
    return off;
  }, [on, applyMessageToList, markChatRead]);

  // La contraparte leyó mis mensajes → el último (si es mío) pasa a "leído".
  useEffect(() => {
    const off = on("message:read", (raw: unknown) => {
      const p = raw as MessagesRead;
      setConversations((prev) =>
        prev
          ? prev.map((c) =>
              c.conversationId === p.conversationId &&
              c.lastMessage?.fromMe &&
              !c.lastMessage.readAt
                ? {
                    ...c,
                    lastMessage: { ...c.lastMessage, readAt: p.readAt },
                  }
                : c,
            )
          : prev,
      );
    });
    return off;
  }, [on]);

  // Presencia: la contraparte se conectó/desconectó → actualiza su punto.
  useEffect(() => {
    const off = on("presence:changed", (raw: unknown) => {
      const p = raw as { conversationId: string; online: boolean };
      setConversations((prev) =>
        prev
          ? prev.map((c) =>
              c.conversationId === p.conversationId
                ? { ...c, online: p.online }
                : c,
            )
          : prev,
      );
    });
    return off;
  }, [on]);

  // Chat eliminado: la contraparte lo borró → lo quito (y cierro si está abierto).
  useEffect(() => {
    const off = on("conversation:deleted", (raw: unknown) => {
      const { conversationId } = raw as { conversationId: string };
      removeConversation(conversationId);
    });
    return off;
  }, [on, removeConversation]);

  // Chat nuevo: alguien inició una conversación con mi PIN → aparece en la lista.
  useEffect(() => {
    const off = on("conversation:new", (raw: unknown) => {
      const item = raw as ConversationListItem;
      setConversations((prev) => {
        if (!prev) return prev; // aún cargando: el fetch ya lo incluirá
        if (prev.some((c) => c.conversationId === item.conversationId)) {
          return prev; // ya está (evita duplicados)
        }
        return [item, ...prev];
      });
    });
    return off;
  }, [on]);

  // Sincroniza en vivo cuando la contraparte cambia su anonimidad.
  useEffect(() => {
    const off = on("conversation:updated", (raw: unknown) => {
      const p = raw as ConversationCounterpartUpdate;
      setConversations((prev) =>
        prev
          ? prev.map((c) =>
              c.conversationId === p.conversationId
                ? {
                    ...c,
                    isAnonymous: p.counterpart.isAnonymous,
                    displayName: p.counterpart.displayName,
                    avatar: p.counterpart.avatarThumbnail,
                  }
                : c,
            )
          : prev,
      );
    });
    return off;
  }, [on]);

  const selected =
    conversations?.find((c) => c.conversationId === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setRightView("chat"); // abrir un chat cierra perfil/info
    setSelectedId(id);
    // Abrir el chat lo marca como leído → limpia el contador local.
    setConversations((prev) =>
      prev
        ? prev.map((c) =>
            c.conversationId === id ? { ...c, unreadCount: 0 } : c,
          )
        : prev,
    );
  };

  /** Cierra el chat abierto (Escape) → vuelve a la bienvenida. */
  const closeChat = useCallback(() => setSelectedId(null), []);

  /** Inicia un chat por PIN, refresca la lista y abre la conversación. */
  const handleCreate = async (pinValue: string) => {
    const res = await createConversation.execute(pinValue);
    await loadConversations();
    setSelectedId(res.conversationId);
    setRightView("chat");
  };

  /** Muestra un aviso transitorio (se oculta solo a los 5s). */
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  /** Inicia un chat aleatorio (prioriza usuarios en línea) y lo abre. */
  const handleRandom = async () => {
    if (randomLoading) return;
    setRandomLoading(true);
    try {
      const res = await startRandomChat.execute();
      await loadConversations();
      setSelectedId(res.conversationId);
      setRightView("chat");
      if (res.warnOffline) {
        showToast(
          "Chat iniciado, pero esta persona probablemente no esté en línea; puede que tarde en responder.",
        );
      }
    } catch (e) {
      const msg = (e as { message?: string } | undefined)?.message;
      showToast(
        msg ??
          "No encontramos usuarios disponibles para un chat aleatorio por ahora.",
      );
    } finally {
      setRandomLoading(false);
    }
  };

  const renderRight = () => {
    if (rightView === "profile") {
      return <ProfilePanel onClose={() => setRightView("chat")} />;
    }
    if (rightView === "info" && selected) {
      return (
        <ChatInfoPanel
          conversationId={selected.conversationId}
          onClose={() => setRightView("chat")}
          onDeleted={() => removeConversation(selected.conversationId)}
        />
      );
    }
    return (
      <ChatCanvas
        conversation={selected}
        onOpenInfo={() => setRightView("info")}
        onClose={closeChat}
        counterpartTyping={
          selected ? typingIds.has(selected.conversationId) : false
        }
        onMessageSent={(id, msg) => applyMessageToList(id, msg, false)}
      />
    );
  };

  // En móvil se muestra UNA sola pantalla: la lista, o el panel activo (chat/
  // perfil/info) a pantalla completa. En escritorio (md+) ambos lado a lado.
  const showPane = rightView !== "chat" || selectedId !== null;

  return (
    <div className="relative flex h-dvh overflow-hidden bg-neutral-50 dark:bg-uptc-carbon">
      {/* Glow ambiental dorado (da profundidad tras los paneles glass) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-40 size-[28rem] rounded-full bg-uptc-gold/10 blur-3xl dark:bg-uptc-gold/[0.06]" />
        <div className="absolute -bottom-56 left-1/3 size-[34rem] rounded-full bg-uptc-gold-light/10 blur-3xl dark:bg-uptc-gold/[0.05]" />
        <div className="absolute -right-40 top-1/4 size-[26rem] rounded-full bg-uptc-gold/[0.07] blur-3xl dark:bg-uptc-gold/[0.04]" />
      </div>

      <ChatSidebar
        conversations={conversations ?? []}
        loading={conversations === null}
        selectedId={rightView === "profile" ? null : selectedId}
        onSelect={handleSelect}
        onOpenProfile={() => setRightView("profile")}
        onNewChat={() => setShowNewChat(true)}
        onRandomChat={() => void handleRandom()}
        randomLoading={randomLoading}
        pin={pin}
        typingIds={typingIds}
        openChatId={rightView === "chat" ? selectedId : null}
        mobileHidden={showPane}
      />
      <div
        className={`relative z-10 flex-1 overflow-hidden ${
          showPane ? "flex" : "hidden md:flex"
        }`}
      >
        {renderRight()}
      </div>

      {showNewChat ? (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onCreate={handleCreate}
        />
      ) : null}

      {/* Aviso transitorio */}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4">
          <div className="pointer-events-auto max-w-sm animate-fade-up rounded-2xl border border-uptc-gold/30 bg-white/95 px-4 py-3 text-sm text-uptc-carbon shadow-soft backdrop-blur-xl dark:bg-uptc-graphite/95 dark:text-neutral-100">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
