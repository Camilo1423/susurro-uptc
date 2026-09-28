import { SessionExpiredModal } from "@Components";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { NavigationProvider } from "../context/NavigationContext";
import { ThemeProvider } from "../context/ThemeContext";

/**
 * Proveedores que viven **ARRIBA** del `RouterProvider` (en `App`), por lo que
 * no se desmontan en las transiciones que remontan el router. Envuelven tanto
 * el `<Loading>` de arranque como el `RouterProvider`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

/**
 * Raíz del data router (elemento de la ruta `/`). Vive **DENTRO** del
 * `RouterProvider` porque `NavigationProvider` usa `useLocation`.
 */
export function Providers() {
  return (
    <NavigationProvider>
      <Outlet />
      <SessionExpiredModal />
    </NavigationProvider>
  );
}
