import { PrismaService } from '../shared/modules/prisma/index.js';
export declare class DocumentTypesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        name: string;
        code: string;
    }[]>;
}
