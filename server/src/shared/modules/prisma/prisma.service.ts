import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client.js';
import {
  paginatePrisma,
  PrismaModelDelegate,
  PrismaPaginationOptions,
} from './utils/prisma-pagination.util.js';
import { PagedValue } from './types/pagination.type.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    // Prisma 7 requiere un driver adapter para conectarse (igual que RIA).
    const adapter = new PrismaPg({
      connectionString: configService.getOrThrow<string>('databaseUrl'),
    });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /** Helper de paginación (ver `paginatePrisma`). */
  async paginate<T>(
    model: PrismaModelDelegate,
    options: PrismaPaginationOptions,
  ): Promise<PagedValue<T>> {
    return paginatePrisma<T>(model, options);
  }
}
