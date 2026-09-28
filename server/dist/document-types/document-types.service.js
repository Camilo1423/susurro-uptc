var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma/index.js';
let DocumentTypesService = class DocumentTypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.documentType.findMany({
            where: { status: true },
            select: { id: true, name: true, code: true },
            orderBy: { name: 'asc' },
        });
    }
};
DocumentTypesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DocumentTypesService);
export { DocumentTypesService };
//# sourceMappingURL=document-types.service.js.map