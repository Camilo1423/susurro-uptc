import { PagedValue, PaginationParams } from '../types/pagination.type.js';
export interface PrismaPaginationOptions extends PaginationParams {
    where?: unknown;
    select?: unknown;
    include?: unknown;
    orderBy?: unknown;
}
export declare function calculatePrismaSkipTake(params: PaginationParams): {
    skip: number;
    take: number;
};
export declare function createPagedValue<T>(items: T[], totalCount: number, params: PaginationParams): PagedValue<T>;
export interface PrismaModelDelegate {
    findMany(args?: unknown): Promise<unknown[]>;
    count(args?: unknown): Promise<number>;
}
export declare function paginatePrisma<T>(model: PrismaModelDelegate, options: PrismaPaginationOptions): Promise<PagedValue<T>>;
