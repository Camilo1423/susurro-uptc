export function calculatePrismaSkipTake(params) {
    const { pageNumber, pageSize } = params;
    return { skip: (pageNumber - 1) * pageSize, take: pageSize };
}
export function createPagedValue(items, totalCount, params) {
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
export async function paginatePrisma(model, options) {
    const { pageNumber, pageSize, where, select, include, orderBy } = options;
    const { skip, take } = calculatePrismaSkipTake({ pageNumber, pageSize });
    const [items, totalCount] = await Promise.all([
        model.findMany({ where, select, include, orderBy, skip, take }),
        model.count({ where }),
    ]);
    return createPagedValue(items, totalCount, { pageNumber, pageSize });
}
//# sourceMappingURL=prisma-pagination.util.js.map