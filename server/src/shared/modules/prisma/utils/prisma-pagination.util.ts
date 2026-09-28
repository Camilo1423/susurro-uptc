import { PagedValue, PaginationParams } from '../types/pagination.type.js';

export interface PrismaPaginationOptions extends PaginationParams {
  where?: unknown;
  select?: unknown;
  include?: unknown;
  orderBy?: unknown;
}

export function calculatePrismaSkipTake(params: PaginationParams): {
  skip: number;
  take: number;
} {
  const { pageNumber, pageSize } = params;
  return { skip: (pageNumber - 1) * pageSize, take: pageSize };
}

export function createPagedValue<T>(
  items: T[],
  totalCount: number,
  params: PaginationParams,
): PagedValue<T> {
  const { pageNumber, pageSize } = params;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
}

/**
 * Delegate mínimo de un modelo de Prisma. Se declara con sintaxis de MÉTODO (no
 * arrow) a propósito: así los parámetros se comparan de forma bivariante y
 * cualquier delegate de Prisma (findMany/count sobrecargados) es asignable.
 */
export interface PrismaModelDelegate {
  findMany(args?: unknown): Promise<unknown[]>;
  count(args?: unknown): Promise<number>;
}

/**
 * Helper genérico para paginar un modelo de Prisma.
 * @example
 * const result = await paginatePrisma<User>(prisma.user, {
 *   pageNumber: 1, pageSize: 10, where: { status: 'ACTIVE' },
 *   orderBy: { createdAt: 'desc' },
 * });
 */
export async function paginatePrisma<T>(
  model: PrismaModelDelegate,
  options: PrismaPaginationOptions,
): Promise<PagedValue<T>> {
  const { pageNumber, pageSize, where, select, include, orderBy } = options;
  const { skip, take } = calculatePrismaSkipTake({ pageNumber, pageSize });

  const [items, totalCount] = await Promise.all([
    model.findMany({ where, select, include, orderBy, skip, take }),
    model.count({ where }),
  ]);

  return createPagedValue<T>(items as T[], totalCount, { pageNumber, pageSize });
}
