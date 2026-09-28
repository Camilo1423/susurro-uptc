import { Loading, ThemeSwitcher } from "@Components";
import { useNavigationState } from "@Hooks";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

/** Layout de las rutas públicas (login, etc.). */
export const LayoutPublic = () => {
  const { loading } = useNavigationState();
  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>
      <Suspense
        fallback={<Loading fullScreen size="md" message="Cargando página..." />}
      >
        {loading ? (
          <Loading fullScreen size="md" message="Cargando módulo..." />
        ) : (
          <Outlet />
        )}
      </Suspense>
    </>
  );
};
