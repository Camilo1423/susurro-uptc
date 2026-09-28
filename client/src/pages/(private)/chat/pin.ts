/**
 * Formatea el PIN del usuario (8 caracteres, como lo entrega el backend) para
 * mostrarlo agrupado como `XXXX-XXXX`. Es solo presentación; el valor real vive
 * en `user.pin`.
 */
export function formatPin(pin: string): string {
  const clean = pin.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}
