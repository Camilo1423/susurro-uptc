import { Loading } from "@Components";
import { useSession } from "@Hooks";
import { AppProviders } from "@Providers";
import { useAppSelector } from "@Redux";
import { useEffect, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./routes/router";

const App = () => {
  const { isLoadingSession, reloadSession } = useSession();

  // Loader global: mientras está activo (p. ej. logout/reset) se desmonta el
  // router para remontarlo limpio.
  const globalLoading = useAppSelector((state) => state.loading.global);

  // El router es ESTÁTICO: se crea una sola vez (no depende de módulos remotos).
  const router = useMemo(() => createRouter(), []);

  useEffect(() => {
    void reloadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLoader = globalLoading || isLoadingSession;
  const loaderMessage = globalLoading
    ? "Preparando espacio de trabajo..."
    : "Validando datos...";

  return (
    <AppProviders>
      {showLoader ? (
        <Loading fullScreen message={loaderMessage} />
      ) : (
        <RouterProvider router={router} />
      )}
    </AppProviders>
  );
};

export default App;
