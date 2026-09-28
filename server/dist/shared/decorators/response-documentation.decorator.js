import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/api-response.dto.js';
export function ApiStandardResponse(model, status = 200, description = 'Operación exitosa', isArray = false) {
    const models = model ? [ApiResponseDto, model] : [ApiResponseDto];
    const existingModel = model
        ? {
            properties: {
                data: isArray
                    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                    : { $ref: getSchemaPath(model) },
            },
        }
        : {};
    return applyDecorators(ApiExtraModels(...models), ApiResponse({
        status,
        description,
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponseDto) }, { ...existingModel }],
        },
    }));
}
//# sourceMappingURL=response-documentation.decorator.js.map