import { z } from 'zod';

/**
 * Validación de variables de entorno con Zod (clonado de RIA). Si algo falta o
 * es inválido, la app no arranca y muestra exactamente qué corregir.
 */
const envSchema = z.object({
  // App
  ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  // Base de datos (la usa Prisma vía prisma.config / DATABASE_URL)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Redis (blacklist de tokens revocados por JTI)
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  // Almacenamiento de objetos (MinIO / S3-compatible)
  SPACES_ENDPOINT: z.string().min(1, 'SPACES_ENDPOINT is required'),
  SPACES_KEY: z.string().min(1, 'SPACES_KEY is required'),
  SPACES_SECRET: z.string().min(1, 'SPACES_SECRET is required'),
  SPACES_BUCKET: z.string().min(1, 'SPACES_BUCKET is required'),

  // JWT (access + refresh)
  JWT_SECRET_ACCESS: z.string().min(1, 'JWT_SECRET_ACCESS is required'),
  JWT_SECRET_REFRESH: z.string().min(1, 'JWT_SECRET_REFRESH is required'),
  JWT_SECRET_SOCKET: z.string().min(1, 'JWT_SECRET_SOCKET is required'),
  JWT_ISSUER: z.string().default('anomchat'),
  JWT_AUDIENCE: z.string().default('anomchat-api'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  JWT_SOCKET_TOKEN_EXPIRES_IN: z.string().default('1h'),

  // Cookies
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  // CORS: orígenes permitidos, separados por coma
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  // Seguridad: bloqueo por intentos fallidos de login
  SECURITY_MAX_FAILED_ATTEMPTS: z.coerce.number().default(5),
  SECURITY_BLOCK_DURATION_MINUTES: z.coerce.number().default(30),

  // Swagger (docs)
  API_KEY_SWAGGER: z.string().default('anomchat-swagger-key'),
  URL_SWAGGER: z.string().default('/api/docs'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\n❌ Invalid environment variables:\n${formatted}\n\nFix the above and restart the app.\n`,
    );
  }

  return result.data;
}
