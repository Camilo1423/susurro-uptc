import { useCallback } from "react";
import {
  type NavigateOptions,
  type To,
  useNavigate as useNavigateRouter,
} from "react-router-dom";
import { useNavigationState } from "./useNavigationState";

/**
 * Envuelve `useNavigate` de react-router para activar el estado de navegación
 * (loader entre páginas lazy) antes de cada transición.
 */
export function useNavigate(): {
  (to: To, options?: NavigateOptions): void | Promise<void>;
  (delta: number): void | Promise<void>;
} {
  const navigate = useNavigateRouter();
  const { setLoading } = useNavigationState();

  return useCallback(
    ((to: To | number, options?: NavigateOptions) => {
      setLoading(true);
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, options);
      }
    }) as {
      (to: To, options?: NavigateOptions): void | Promise<void>;
      (delta: number): void | Promise<void>;
    },
    [navigate, setLoading],
  );
}
