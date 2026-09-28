/* eslint-disable no-console */

/**
 * Logger centralizado. Envuelve `console` para poder silenciar o redirigir
 * los logs desde un único punto (por ejemplo, deshabilitarlos en producción).
 */
export const Logger = {
  log: (...args: unknown[]) => console.log(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};
