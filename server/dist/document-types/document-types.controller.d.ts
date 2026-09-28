import { ApiResponseDto } from '../shared/dtos/index.js';
import { DocumentTypesService } from './document-types.service.js';
export declare class DocumentTypesController {
    private readonly documentTypesService;
    constructor(documentTypesService: DocumentTypesService);
    findAll(): Promise<ApiResponseDto<unknown>>;
}
