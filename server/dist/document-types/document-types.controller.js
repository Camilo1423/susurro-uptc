var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentTypesService } from './document-types.service.js';
let DocumentTypesController = class DocumentTypesController {
    documentTypesService;
    constructor(documentTypesService) {
        this.documentTypesService = documentTypesService;
    }
    async findAll() {
        const data = await this.documentTypesService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Tipos de documento obtenidos',
            data,
        };
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Listar tipos de documento' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentTypesController.prototype, "findAll", null);
DocumentTypesController = __decorate([
    ApiTags('document-types'),
    Controller('v1/document-types'),
    __metadata("design:paramtypes", [DocumentTypesService])
], DocumentTypesController);
export { DocumentTypesController };
//# sourceMappingURL=document-types.controller.js.map