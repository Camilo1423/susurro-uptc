/**
 * Algoritmo de firma/verificación de TODOS los JWT del sistema.
 *
 * Es un INVARIANTE de seguridad (secreto simétrico → HMAC): se fija en código
 * para blindar contra downgrade, algorithm-confusion y `alg: none`. Al verificar
 * se usa como whitelist (`algorithms: [JWT_ALGORITHM]`).
 */
export const JWT_ALGORITHM = 'HS256' as const;
