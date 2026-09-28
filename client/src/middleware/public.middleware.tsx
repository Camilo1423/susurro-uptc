import { Navigate } from "@Components";
import { SERVICES_TYPES } from "@Container";
import { useInjection } from "@Hooks";
import type { RootState } from "@Redux";
import type { LocalStorageService } from "@Services";
import { SIGN_IN_STATUS_KEY, SignInStatus } from "@Types";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

/** Destino tras autenticarse por completo. */
const AUTHENTICATED_HOME = "/dashboard";

/**
 * Guard de las rutas públicas (login, etc.): si ya hay sesión (en memoria o por
 * el flag `statusSignIn`), expulsa hacia el home privado. En cualquier otro
 * caso renderiza la ruta pública solicitada.
 */
const PublicMiddleware = ({ children }: { children?: ReactNode }) => {
  const storage = useInjection<LocalStorageService>(
    SERVICES_TYPES._LocalStorageService,
  );
  const user = useSelector((state: RootState) => state.session.user);

  const isAuthenticated =
    storage.getItem<string>(SIGN_IN_STATUS_KEY) === SignInStatus.Done;

  if (user || isAuthenticated) {
    return <Navigate to={AUTHENTICATED_HOME} replace />;
  }

  return children ?? <Outlet />;
};

export default PublicMiddleware;
