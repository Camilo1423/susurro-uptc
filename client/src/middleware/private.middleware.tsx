import { Navigate } from "@Components";
import { SERVICES_TYPES } from "@Container";
import { useInjection } from "@Hooks";
import type { LocalStorageService } from "@Services";
import { SIGN_IN_STATUS_KEY, SignInStatus } from "@Types";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

/** Login (ruta pública raíz). */
const LOGIN_PATH = "/";

/**
 * Guard de las rutas privadas: sin sesión (`statusSignIn !== DONE`) redirige al
 * login. Como las cookies son httpOnly, `statusSignIn` es la referencia de
 * sesión que sobrevive a un refresco; el usuario en Redux se rehidrata con
 * `useSession().reloadSession`.
 */
const PrivateMiddleware = ({ children }: { children?: ReactNode }) => {
  const storage = useInjection<LocalStorageService>(
    SERVICES_TYPES._LocalStorageService,
  );

  const isAuthenticated =
    storage.getItem<string>(SIGN_IN_STATUS_KEY) === SignInStatus.Done;

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  return children ?? <Outlet />;
};

export default PrivateMiddleware;
