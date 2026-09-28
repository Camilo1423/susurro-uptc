import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";
import { useNavigationState } from "../../hooks/useNavigationState";
import { isSpaNavigation } from "./isSpaNavigation";

/**
 * `Link` enmascarado. Igual que el de react-router, pero al hacer click activa
 * el estado de navegación (`setLoading(true)` del `NavigationContext`) para
 * mostrar el loader mientras se descarga el chunk lazy de la ruta destino.
 *
 * Es el workaround al problema de react-router con `lazy` + `import()`, donde el
 * fallback de Suspense no siempre se muestra: controlamos la descarga vía el
 * contexto. El loader se apaga solo cuando la ubicación cambia (ver
 * `NavigationProvider`, que resetea `loading` en cada cambio de `location`).
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { onClick, target, ...rest },
  ref,
) {
  const { setLoading } = useNavigationState();

  return (
    <RouterLink
      ref={ref}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        if (isSpaNavigation(e, target)) setLoading(true);
      }}
      {...rest}
    />
  );
});
