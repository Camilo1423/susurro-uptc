import { useState } from "react";

interface PinRevealProps {
  pin: string;
}

/**
 * Bloque suave con el PIN del usuario. Empieza oculto; el botón lo revela. El PIN
 * es la forma de que otros te encuentren, así que se puede copiar para compartir.
 */
export default function PinReveal({ pin }: PinRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard no disponible: se ignora */
    }
  };

  return (
    <div className="rounded-2xl bg-uptc-gold/[0.08] px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-uptc-gold/20 text-uptc-gold-light">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m15.5 7.5 3 3L22 7l-3-3" />
            <path d="m21 2-9.6 9.6" />
            <circle cx="7.5" cy="15.5" r="5.5" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-uptc-graphite/70 dark:text-neutral-400">
            Tu PIN
          </p>
          <code className="font-display text-base font-bold tracking-widest text-uptc-carbon dark:text-white">
            {revealed ? pin : "••••-••••"}
          </code>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {revealed ? (
            <button
              type="button"
              onClick={() => void copy()}
              aria-label="Copiar PIN"
              title="Copiar PIN"
              className="rounded-full px-2.5 py-1 text-xs font-semibold text-uptc-gold transition-colors hover:bg-uptc-gold/15"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-uptc-gold transition-colors hover:bg-uptc-gold/15"
          >
            {revealed ? "Ocultar" : "Revelar"}
          </button>
        </div>
      </div>
    </div>
  );
}
