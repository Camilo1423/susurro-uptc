import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        staging: "staging";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        fatal: "fatal";
        error: "error";
        warn: "warn";
        info: "info";
        debug: "debug";
        trace: "trace";
    }>>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    SPACES_ENDPOINT: z.ZodString;
    SPACES_KEY: z.ZodString;
    SPACES_SECRET: z.ZodString;
    SPACES_BUCKET: z.ZodString;
    JWT_SECRET_ACCESS: z.ZodString;
    JWT_SECRET_REFRESH: z.ZodString;
    JWT_SECRET_SOCKET: z.ZodString;
    JWT_ISSUER: z.ZodDefault<z.ZodString>;
    JWT_AUDIENCE: z.ZodDefault<z.ZodString>;
    JWT_ACCESS_TOKEN_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_TOKEN_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_SOCKET_TOKEN_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    COOKIE_DOMAIN: z.ZodDefault<z.ZodString>;
    COOKIE_SECURE: z.ZodPipe<z.ZodDefault<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false">>;
    CORS_ORIGINS: z.ZodDefault<z.ZodString>;
    SECURITY_MAX_FAILED_ATTEMPTS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    SECURITY_BLOCK_DURATION_MINUTES: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    API_KEY_SWAGGER: z.ZodDefault<z.ZodString>;
    URL_SWAGGER: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare function validateEnv(): EnvConfig;
export {};
