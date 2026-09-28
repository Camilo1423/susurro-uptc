import { validateEnv } from './env.validation.js';

/**
 * Configuración de la app (namespaced). Valida el entorno al arrancar y expone
 * los valores ya tipados/derivados a `ConfigService`.
 */
export const configuration = (): Record<string, unknown> => {
  const env = validateEnv();

  return {
    version: '1.0.0',
    env: env.ENV,
    port: env.PORT,
    logLevel: env.LOG_LEVEL,

    databaseUrl: env.DATABASE_URL,

    // Redis (blacklist de tokens revocados)
    redisUrl: env.REDIS_URL,

    // Almacenamiento de objetos (MinIO / S3-compatible)
    spaces_endpoint: env.SPACES_ENDPOINT,
    spaces_key: env.SPACES_KEY,
    spaces_secret: env.SPACES_SECRET,
    spaces_bucket: env.SPACES_BUCKET,

    // JWT
    jwtSecretAccess: env.JWT_SECRET_ACCESS,
    jwtSecretRefresh: env.JWT_SECRET_REFRESH,
    jwtSecretSocket: env.JWT_SECRET_SOCKET,
    jwtIssuer: env.JWT_ISSUER,
    jwtAudience: env.JWT_AUDIENCE,
    jwtExpiresInAccess: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwtExpiresInRefresh: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    jwtExpiresInSocket: env.JWT_SOCKET_TOKEN_EXPIRES_IN,

    // Cookies
    domain: env.COOKIE_DOMAIN,
    cookieSecure: env.COOKIE_SECURE,

    // CORS
    corsOrigins: env.CORS_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean),

    // Seguridad
    security: {
      maxFailedAttempts: env.SECURITY_MAX_FAILED_ATTEMPTS,
      blockDurationMinutes: env.SECURITY_BLOCK_DURATION_MINUTES,
    },

    // Swagger
    apiKeySwagger: env.API_KEY_SWAGGER,
    urlSwagger: env.URL_SWAGGER,
  };
};
