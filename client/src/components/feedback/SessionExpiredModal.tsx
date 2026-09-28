import { useSession } from "@Hooks";
import { useAppSelector } from "@Redux";

/**
 * Modal de "sesión expirada". Lo abre el interceptor de axios (`openModal`)
 * cuando el refresh de token falla definitivamente. Al aceptar, limpia todo y
 * vuelve al login vía `useSession().resetToLogin`.
 */
export default function SessionExpiredModal() {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const { resetToLogin } = useSession();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-white p-6 text-uptc-carbon shadow-soft dark:bg-uptc-graphite dark:text-neutral-100">
        <h2 className="mt-0 font-display text-lg font-bold">Sesión expirada</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tu sesión ha caducado. Vuelve a iniciar sesión para continuar.
        </p>
        <button
          type="button"
          onClick={() => void resetToLogin()}
          className="btn-gold mt-4 w-full"
        >
          Ir al inicio de sesión
        </button>
      </div>
    </div>
  );
}
