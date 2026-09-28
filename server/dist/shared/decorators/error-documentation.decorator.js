import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dtos/error-response.dto.js';
export function ApiErrorResponse(status = 400, description = 'Error en la operación') {
    return applyDecorators(ApiExtraModels(ErrorResponseDto), ApiResponse({
        status,
        description,
        schema: { allOf: [{ $ref: getSchemaPath(ErrorResponseDto) }] },
    }));
}
//# sourceMappingURL=error-documentation.decorator.js.map