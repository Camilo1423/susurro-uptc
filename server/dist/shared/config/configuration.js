import { validateEnv } from './env.validation.js';
export const configuration = () => {
    const env = validateEnv();
    return {
        version: '1.0.0',
        env: env.ENV,
        port: env.PORT,
        logLevel: env.LOG_LEVEL,
        databaseUrl: env.DATABASE_URL,
        redisUrl: env.REDIS_URL,
        spaces_endpoint: env.SPACES_ENDPOINT,
        spaces_key: env.SPACES_KEY,
        spaces_secret: env.SPACES_SECRET,
        spaces_bucket: env.SPACES_BUCKET,
        jwtSecretAccess: env.JWT_SECRET_ACCESS,
        jwtSecretRefresh: env.JWT_SECRET_REFRESH,
        jwtSecretSocket: env.JWT_SECRET_SOCKET,
        jwtIssuer: env.JWT_ISSUER,
        jwtAudience: env.JWT_AUDIENCE,
        jwtExpiresInAccess: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        jwtExpiresInRefresh: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        jwtExpiresInSocket: env.JWT_SOCKET_TOKEN_EXPIRES_IN,
        domain: env.COOKIE_DOMAIN,
        cookieSecure: env.COOKIE_SECURE,
        corsOrigins: env.CORS_ORIGINS.split(',')
            .map((o) => o.trim())
            .filter(Boolean),
        security: {
            maxFailedAttempts: env.SECURITY_MAX_FAILED_ATTEMPTS,
            blockDurationMinutes: env.SECURITY_BLOCK_DURATION_MINUTES,
        },
        apiKeySwagger: env.API_KEY_SWAGGER,
        urlSwagger: env.URL_SWAGGER,
    };
};
//# sourceMappingURL=configuration.js.map