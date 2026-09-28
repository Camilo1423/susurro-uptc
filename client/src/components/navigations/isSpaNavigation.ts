import type { MouseEvent } from "react";

/**
 * Decide si un click en un `<a>` corresponde a una navegación SPA "real" que
 * debe activar el loader de navegación. Devuelve `false` para clicks que NO
 * navegan dentro de la app (nueva pestaña, click con modificadores, botón
 * distinto al principal, o `target` externo), para no dejar el loader colgado.
 */
export function isSpaNavigation(
  e: MouseEvent<HTMLAnchorElement>,
  target?: string,
): boolean {
  return !(
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    (!!target && target !== "_self")
  );
}
