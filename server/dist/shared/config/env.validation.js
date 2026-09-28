import { z } from 'zod';
const envSchema = z.object({
    ENV: z.enum(['development', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .default('info'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
    SPACES_ENDPOINT: z.string().min(1, 'SPACES_ENDPOINT is required'),
    SPACES_KEY: z.string().min(1, 'SPACES_KEY is required'),
    SPACES_SECRET: z.string().min(1, 'SPACES_SECRET is required'),
    SPACES_BUCKET: z.string().min(1, 'SPACES_BUCKET is required'),
    JWT_SECRET_ACCESS: z.string().min(1, 'JWT_SECRET_ACCESS is required'),
    JWT_SECRET_REFRESH: z.string().min(1, 'JWT_SECRET_REFRESH is required'),
    JWT_SECRET_SOCKET: z.string().min(1, 'JWT_SECRET_SOCKET is required'),
    JWT_ISSUER: z.string().default('anomchat'),
    JWT_AUDIENCE: z.string().default('anomchat-api'),
    JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    JWT_SOCKET_TOKEN_EXPIRES_IN: z.string().default('1h'),
    COOKIE_DOMAIN: z.string().default('localhost'),
    COOKIE_SECURE: z
        .enum(['true', 'false'])
        .default('false')
        .transform((v) => v === 'true'),
    CORS_ORIGINS: z.string().default('http://localhost:5173'),
    SECURITY_MAX_FAILED_ATTEMPTS: z.coerce.number().default(5),
    SECURITY_BLOCK_DURATION_MINUTES: z.coerce.number().default(30),
    API_KEY_SWAGGER: z.string().default('anomchat-swagger-key'),
    URL_SWAGGER: z.string().default('/api/docs'),
});
export function validateEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        const formatted = result.error.issues
            .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
            .join('\n');
        throw new Error(`\n❌ Invalid environment variables:\n${formatted}\n\nFix the above and restart the app.\n`);
    }
    return result.data;
}
//# sourceMappingURL=env.validation.js.map