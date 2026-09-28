import { USE_CASES_TYPES } from "@Container";
import { useInjection, useSocket } from "@Hooks";
import type { ChatDetail, ConversationCounterpartUpdate } from "@Types";
import type {
  DeleteConversationUseCase,
  GetChatDetailUseCase,
  SetChatAnonymityUseCase,
} from "@UseCase";
import { ArrowLeft, Eye, Loader2, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatInfoPanelProps {
  conversationId: string;
  onClose: () => void;
  /** Se llama tras eliminar el chat (para quitarlo de la lista y cerrar). */
  onDeleted: () => void;
}

/** Iniciales de fallback a partir del nombre a mostrar. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Vista de información del chat (reemplaza el canvas). Muestra los datos del otro
 * participante y permite activar/desactivar MI modo anónimo. Escape para salir.
 */
export default function ChatInfoPanel({
  conversationId,
  onClose,
  onDeleted,
}: ChatInfoPanelProps) {
  const getDetail = useInjection<GetChatDetailUseCase>(
    USE_CASES_TYPES._GetChatDetail,
  );
  const setAnonymity = useInjection<SetChatAnonymityUseCase>(
    USE_CASES_TYPES._SetChatAnonymity,
  );
  const deleteConversation = useInjection<DeleteConversationUseCase>(
    USE_CASES_TYPES._DeleteConversation,
  );
  const { on, isConnected } = useSocket();

  const [detail, setDetail] = useState<ChatDetail | null>(null);
  const [imgError, setImgError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasConnectedOnce = useRef(false);

  const loadDetail = useCallback(async () => {
    try {
      setDetail(await getDetail.execute(conversationId));
    } catch {
      setError("No se pudo cargar la información.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Escape: cierra primero el confirmar, luego el visor, luego el panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmOpen) setConfirmOpen(false);
      else if (viewerOpen) setViewerOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, viewerOpen, onClose]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  // Reconciliación: al RE-conectar el socket, vuelve a pedir el detalle.
  useEffect(() => {
    if (!isConnected) return;
    if (hasConnectedOnce.current) {
      void loadDetail();
    } else {
      hasConnectedOnce.current = true;
    }
  }, [isConnected, loadDetail]);

  // Sincroniza en vivo si la contraparte de ESTE chat cambia su anonimidad.
  useEffect(() => {
    const off = on("conversation:updated", (raw: unknown) => {
      const p = raw as ConversationCounterpartUpdate;
      if (p.conversationId !== conversationId) return;
      setImgError(false);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              counterpart: {
                isAnonymous: p.counterpart.isAnonymous,
                displayName: p.counterpart.displayName,
                avatar: p.counterpart.avatarOriginal,
              },
            }
          : prev,
      );
    });
    return off;
  }, [on, conversationId]);

  const toggleAnonymity = async () => {
    if (!detail || busy) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await setAnonymity.execute(
        conversationId,
        !detail.me.isAnonymous,
      );
      setDetail(updated);
    } catch {
      setError("No se pudo actualizar el modo anónimo.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteConversation.execute(conversationId);
      setConfirmOpen(false);
      onDeleted(); // quita de la lista y cierra el panel
    } catch {
      setError("No se pudo eliminar el chat.");
      setDeleting(false);
    }
  };

  const showImg = Boolean(detail?.counterpart.avatar) && !imgError;
  const anon = detail?.me.isAnonymous ?? false;
  // El detalle ya entrega la versión ORIGINAL (o null si no hay foto).
  const originalUrl = detail?.counterpart.avatar ?? null;

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-neutral-200/70 bg-white px-6 py-3 dark:border-white/5 dark:bg-uptc-graphite">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="grid size-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
        >
          <ArrowLeft className="size-5" />
        </button>
        <p className="font-display text-lg font-bold text-uptc-carbon dark:text-white">
          Información del chat
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10">
        {!detail ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-uptc-gold" />
          </div>
        ) : (
          <div className="mx-auto max-w-sm">
            {/* Contraparte */}
            <div className="flex flex-col items-center text-center">
              {showImg ? (
                <button
                  type="button"
                  onClick={() => setViewerOpen(true)}
                  title="Ver foto"
                  className="group relative size-28 overflow-hidden rounded-full"
                >
                  <img
                    src={detail.counterpart.avatar ?? undefined}
                    alt="Foto del contacto"
                    className="size-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="size-6 text-white" />
                  </span>
                </button>
              ) : (
                <div className="grid size-28 place-items-center rounded-full bg-gradient-to-br from-uptc-gold/40 to-uptc-gold/10 text-3xl font-bold text-uptc-carbon dark:text-uptc-gold-light">
                  {initialsOf(detail.counterpart.displayName)}
                </div>
              )}
              <h2 className="mt-4 font-display text-2xl font-bold text-uptc-carbon dark:text-white">
                {detail.counterpart.displayName}
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {detail.counterpart.isAnonymous
                  ? "Este usuario está en modo anónimo"
                  : "Identidad visible"}
              </p>
            </div>

            <div className="divider-gold my-8" />

            {/* Mi privacidad */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Tu privacidad
            </p>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-100 px-4 py-3 dark:bg-white/5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-uptc-carbon dark:text-white">
                  Modo anónimo
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {anon
                    ? `Te ven como "${detail.me.alias}"`
                    : "El otro ve tu identidad real"}
                </p>
              </div>

              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={anon}
                aria-label="Modo anónimo"
                disabled={busy}
                onClick={() => void toggleAnonymity()}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
                  anon ? "bg-uptc-gold" : "bg-neutral-300 dark:bg-white/15"
                }`}
              >
                <span
                  className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                    anon ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {error ? <p className="field-error mt-3">{error}</p> : null}

            <div className="divider-gold my-8" />

            {/* Zona de peligro: eliminar el chat */}
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
            >
              <Trash2 className="size-4" />
              Eliminar chat
            </button>
            <p className="mt-2 text-center text-xs text-neutral-400">
              Se borrará para ambos, junto con todos los mensajes.
            </p>
          </div>
        )}
      </div>

      {/* Confirmación de eliminación */}
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6"
          onMouseDown={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft dark:bg-uptc-graphite"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              <Trash2 className="size-6" />
            </div>
            <h3 className="mt-4 text-center font-display text-lg font-bold text-uptc-carbon dark:text-white">
              ¿Eliminar este chat?
            </h3>
            <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Se eliminará para ti y para la otra persona, junto con todos los
              mensajes. Esta acción no se puede deshacer.
            </p>

            {error ? <p className="field-error mt-3">{error}</p> : null}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmOpen(false)}
                className="btn-outline flex-1 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Visor de la foto (original) */}
      {viewerOpen && originalUrl ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onMouseDown={() => setViewerOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setViewerOpen(false)}
            className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <img
            src={originalUrl}
            alt="Foto del contacto"
            className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain"
          />
        </div>
      ) : null}
    </main>
  );
}
