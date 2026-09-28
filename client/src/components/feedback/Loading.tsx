interface LoadingProps {
  /** Ocupa toda la pantalla (overlay centrado). */
  fullScreen?: boolean;
  /** Renderiza el loader dentro de su contenedor (no fixed). */
  contained?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const SIZE_MAP: Record<NonNullable<LoadingProps["size"]>, string> = {
  sm: "size-5",
  md: "size-8",
  lg: "size-12",
};

/** Indicador de carga reutilizable (spinner + mensaje opcional). */
export default function Loading({
  fullScreen = false,
  contained = false,
  size = "md",
  message,
}: LoadingProps) {
  const base = "flex flex-col items-center justify-center gap-4";
  const padding = contained ? "p-12" : "p-4";
  const wrapperClass = fullScreen
    ? `${base} fixed inset-0 z-50 bg-neutral-50 dark:bg-uptc-carbon`
    : `${base} ${padding}`;

  return (
    <div className={wrapperClass} role="status" aria-live="polite">
      <span
        className={`${SIZE_MAP[size]} inline-block animate-spin rounded-full border-[3px] border-uptc-gold/25 border-t-uptc-gold`}
      />
      {message ? (
        <p className="m-0 text-sm text-neutral-500 dark:text-neutral-400">
          {message}
        </p>
      ) : null}
    </div>
  );
}
