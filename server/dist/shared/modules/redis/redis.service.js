var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
import { Injectable, Logger, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
let RedisService = RedisService_1 = class RedisService {
    _client;
    logger = new Logger(RedisService_1.name);
    constructor(configService) {
        const redisUrl = configService.getOrThrow('redisUrl');
        this._client = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    this.logger.warn(`Reconnecting to Redis (attempt: ${retries})`);
                    return Math.min(retries * 100, 5000);
                },
            },
        });
        this._client.on('error', (err) => this.logger.error('Redis client error', err));
    }
    async onModuleInit() {
        await this._client.connect();
        this.logger.log('Connected to Redis');
    }
    async onModuleDestroy() {
        await this._client.quit();
    }
    async set(key, value, options) {
        if (options?.ttl && options.ttl > 0) {
            await this._client.set(key, value, {
                expiration: { type: 'EX', value: options.ttl },
            });
        }
        else {
            await this._client.set(key, value);
        }
    }
    async get(key) {
        return (await this._client.get(key));
    }
    async del(...keys) {
        if (keys.length === 0)
            return 0;
        return this._client.del(keys);
    }
    async exists(...keys) {
        if (keys.length === 0)
            return 0;
        return this._client.exists(keys);
    }
};
RedisService = RedisService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], RedisService);
export { RedisService };
//# sourceMappingURL=redis.service.js.map