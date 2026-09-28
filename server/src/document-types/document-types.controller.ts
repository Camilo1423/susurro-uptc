import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../shared/dtos/index.js';
import { DocumentTypesService } from './document-types.service.js';

@ApiTags('document-types')
@Controller('v1/document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de documento' })
  async findAll(): Promise<ApiResponseDto<unknown>> {
    const data = await this.documentTypesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tipos de documento obtenidos',
      data,
    };
  }
}
