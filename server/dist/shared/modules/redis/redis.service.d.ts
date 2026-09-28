import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface RedisSetOptions {
    ttl?: number;
}
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly _client;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    set(key: string, value: string, options?: RedisSetOptions): Promise<void>;
    get(key: string): Promise<string | null>;
    del(...keys: string[]): Promise<number>;
    exists(...keys: string[]): Promise<number>;
}
