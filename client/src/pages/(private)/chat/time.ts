/**
 * Formatea una fecha ISO para la lista de chats: hora (HH:mm) si es hoy, "Ayer",
 * día de la semana si es de esta semana, o dd/MM en otro caso.
 */
export function formatActivity(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const diffDays = Math.floor(
    (startOfToday.getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      86_400_000,
  );

  if (diffDays <= 0) {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) {
    return date.toLocaleDateString("es-CO", { weekday: "short" });
  }
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit" });
}

/** Clave del día local (YYYY-MM-DD) para detectar cambios de día entre mensajes. */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Etiqueta de la "bandera" de fecha dentro del chat: "Hoy" / "Ayer" o la fecha
 * (sin el año si es del año actual).
 */
export function dayLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor(
    (startOfToday.getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      86_400_000,
  );

  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";

  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
