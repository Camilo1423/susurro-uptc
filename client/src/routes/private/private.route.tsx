import { lazy } from "react";
import { SocketContextProvider } from "../../context/SocketContextProvider";
import PrivateMiddleware from "../../middleware/private.middleware";

const ChatPage = lazy(() => import("@Pages/(private)/chat/Chat"));

/** Path base de la app autenticada: la pantalla de chat. */
const DASHBOARD_PATH = "/dashboard";

/**
 * Rutas privadas (estáticas). La app autenticada es una única pantalla de chat
 * bajo `/dashboard`, protegida por `PrivateMiddleware`. El socket vive dentro del
 * área autenticada (`SocketContextProvider`).
 */
export const privateRoutes = [
  {
    path: DASHBOARD_PATH,
    element: (
      <PrivateMiddleware>
        <SocketContextProvider>
          <ChatPage />
        </SocketContextProvider>
      </PrivateMiddleware>
    ),
  },
];
