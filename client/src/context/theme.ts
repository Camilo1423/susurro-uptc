export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "anomchat-theme";

/** Lee el tema persistido (la preferencia); por defecto `"system"`. */
export function getInitialTheme(): Theme {
  if (typeof globalThis === "undefined") return "system";
  const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

/** Resuelve `"system"` a la preferencia real del SO; el resto se devuelve igual. */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof globalThis === "undefined" || !globalThis.matchMedia) {
    return "light";
  }
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Fija SIEMPRE `data-theme` ("light" | "dark") en `<html>`, resolviendo antes el
 * modo "system". La variante `dark:` de Tailwind depende de este atributo (ver
 * `@custom-variant dark` en index.css).
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolveTheme(theme);
}

/**
 * Aplica el tema persistido al `<html>`. Debe llamarse ANTES del primer render
 * (en `main.tsx`) para evitar el flash de tema en el arranque.
 */
export function applyStoredThemeToDocument(): void {
  applyThemeToDocument(getInitialTheme());
}
