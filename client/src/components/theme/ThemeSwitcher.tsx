import { useTheme } from "../../context/ThemeContext";
import type { Theme } from "../../context/theme";

/** Orden del ciclo del toggle. */
const ORDER: Theme[] = ["light", "dark", "system"];

const META: Record<Theme, { label: string; icon: React.ReactNode }> = {
  light: {
    label: "Claro",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
  },
  dark: {
    label: "Oscuro",
    icon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  },
  system: {
    label: "Sistema",
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
};

/**
 * Toggle de tema: cicla claro → oscuro → sistema en cada click. Muestra el icono
 * y la etiqueta del tema activo.
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const { label, icon } = META[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Tema: ${label} (cambiar a ${META[next].label})`}
      aria-label={`Tema actual: ${label}. Cambiar a ${META[next].label}`}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm font-medium text-uptc-graphite transition-colors hover:border-uptc-gold hover:text-uptc-carbon dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {icon}
      </svg>
      {label}
    </button>
  );
}
