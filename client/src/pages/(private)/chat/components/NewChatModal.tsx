import { X } from "lucide-react";
import { useState } from "react";

interface NewChatModalProps {
  onClose: () => void;
  /** Crea la conversación con el PIN dado. Lanza si falla (el modal muestra el error). */
  onCreate: (pin: string) => Promise<void>;
}

/** Extrae un mensaje legible del error del backend. */
function errorMessage(err: unknown): string {
  const data = err as { message?: string | string[] } | undefined;
  const m = data?.message;
  if (Array.isArray(m)) return m[0];
  if (typeof m === "string") return m;
  return "No se pudo iniciar el chat.";
}

/** Modal para iniciar un chat ingresando el PIN del otro usuario. */
export default function NewChatModal({ onClose, onCreate }: NewChatModalProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = pin.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    try {
      await onCreate(value);
      onClose(); // éxito: el padre ya refrescó y seleccionó el chat
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft dark:bg-uptc-graphite">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-uptc-carbon dark:text-white">
            Iniciar chat
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-8 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          Ingresa el PIN de tu amigo para empezar a chatear.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Ej: 8D3E-B850"
            autoFocus
            className="field-input text-center font-display text-lg tracking-widest uppercase"
          />

          {error ? <p className="field-error text-center">{error}</p> : null}

          <div className="mt-1 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !pin.trim()}
              className="btn-gold"
            >
              {loading ? "Iniciando..." : "Iniciar chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
