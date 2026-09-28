import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export interface RedisSetOptions {
  /** Time-to-live en segundos. */
  ttl?: number;
}

/**
 * Cliente Redis para la blacklist de tokens revocados (por JTI). Clonado de la
 * arquitectura de RIA, reducido a las operaciones que se usan aquí.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly _client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(configService: ConfigService) {
    const redisUrl = configService.getOrThrow<string>('redisUrl');
    this._client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          this.logger.warn(`Reconnecting to Redis (attempt: ${retries})`);
          return Math.min(retries * 100, 5000);
        },
      },
    });
    this._client.on('error', (err) =>
      this.logger.error('Redis client error', err),
    );
  }

  async onModuleInit(): Promise<void> {
    await this._client.connect();
    this.logger.log('Connected to Redis');
  }

  async onModuleDestroy(): Promise<void> {
    await this._client.quit();
  }

  async set(
    key: string,
    value: string,
    options?: RedisSetOptions,
  ): Promise<void> {
    if (options?.ttl && options.ttl > 0) {
      await this._client.set(key, value, {
        expiration: { type: 'EX', value: options.ttl },
      });
    } else {
      await this._client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return (await this._client.get(key)) as string | null;
  }

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return this._client.del(keys);
  }

  /** Devuelve cuántas de las claves existen (0 si ninguna). */
  async exists(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return this._client.exists(keys);
  }
}
