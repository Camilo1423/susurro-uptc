import { Transform } from 'class-transformer';

/**
 * Decoradores de transformación para DTOs (class-transformer). Todos verifican
 * que el valor sea string antes de transformarlo, así los campos opcionales
 * (undefined/null) pasan intactos y no rompen la validación.
 */

/** Quita espacios al inicio/fin. */
export const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

/** Quita espacios y pasa a minúsculas (útil para correos). */
export const TrimLowercase = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );

/**
 * Capitaliza cada palabra (Title Case) y colapsa espacios múltiples.
 * Ej: "  juan  MIGUEL " → "Juan Miguel".
 */
export const CapitalizeWords = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

/**
 * Como `CapitalizeWords`, pero si el valor queda vacío devuelve `null`. Útil en
 * campos OPCIONALES: enviar "" limpia el campo y `@IsOptional` omite validaciones
 * (regex, etc.) al ser null.
 */
export const CapitalizeWordsNullable = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

/** Quita espacios; si queda vacío devuelve `null` (campos opcionales que se limpian). */
export const TrimNullable = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  });
