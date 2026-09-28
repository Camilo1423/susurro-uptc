import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/index.js';

@Injectable()
export class DocumentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lista los tipos de documento activos (para formularios). */
  findAll() {
    return this.prisma.documentType.findMany({
      where: { status: true },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    });
  }
}
