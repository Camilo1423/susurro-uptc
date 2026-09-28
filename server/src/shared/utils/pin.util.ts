import { randomBytes } from 'node:crypto';

/**
 * Genera un PIN de descubrimiento: 8 caracteres hexadecimales en mayúscula
 * (mismo formato que el default de BD). Se muestra al usuario agrupado como
 * `XXXX-XXXX`, pero se almacena sin guion.
 */
export function generatePin(): string {
  return randomBytes(4).toString('hex').toUpperCase();
}
