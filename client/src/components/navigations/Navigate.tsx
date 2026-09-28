import { useLayoutEffect } from "react";
import {
  Navigate as RouterNavigate,
  type NavigateProps,
} from "react-router-dom";
import { useNavigationState } from "../../hooks/useNavigationState";

/**
 * `Navigate` enmascarado (redirección declarativa, p. ej. en los guards de
 * middleware). Activa el loader de navegación ANTES de que react-router ejecute
 * la redirección (vía `useLayoutEffect`, que corre antes del efecto pasivo que
 * navega), para cubrir la descarga del chunk lazy del destino. El loader se
 * apaga solo al cambiar la ubicación (ver `NavigationProvider`).
 */
export function Navigate(props: NavigateProps) {
  const { setLoading } = useNavigationState();

  useLayoutEffect(() => {
    setLoading(true);
  }, [setLoading]);

  return <RouterNavigate {...props} />;
}
