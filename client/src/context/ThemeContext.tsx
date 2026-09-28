import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemeToDocument,
  getInitialTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "./theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provee y persiste el tema ('light' | 'dark' | 'system') para toda la app y
 * mantiene `<html data-theme>` sincronizado.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof globalThis !== "undefined") {
      globalThis.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }, []);

  useEffect(() => {
    applyThemeToDocument(themeState);

    // En modo "system", reacciona a los cambios de preferencia del SO.
    if (themeState !== "system" || !globalThis.matchMedia) return;
    const media = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeToDocument("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [themeState]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: themeState, setTheme }),
    [themeState, setTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

/** Accede al tema actual y a su setter. Debe usarse dentro de `<ThemeProvider>`. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}
