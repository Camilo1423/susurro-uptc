import { Link } from "@Components";

interface NotFoundProps {
  /** Si se renderiza dentro de un layout (sin ocupar toda la pantalla). */
  contained?: boolean;
  /** Destino del enlace "volver". Por defecto el dashboard. */
  redirectTo?: string;
}

/** Página 404. Reutilizable en contexto público y privado. */
export default function NotFound({
  contained = false,
  redirectTo = "/dashboard",
}: NotFoundProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-8 ${
        contained ? "" : "min-h-[60vh]"
      }`}
    >
      <h1 className="m-0 font-display text-6xl font-extrabold text-uptc-gold">
        404
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400">
        La página que buscas no existe.
      </p>
      <Link to={redirectTo} className="btn-gold mt-2">
        Volver al inicio
      </Link>
    </div>
  );
}
