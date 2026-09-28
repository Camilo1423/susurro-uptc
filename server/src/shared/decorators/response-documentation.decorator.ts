import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/api-response.dto.js';

/** Documenta una respuesta envuelta en `ApiResponseDto<model>` en Swagger. */
export function ApiStandardResponse<T>(
  model?: Type<T> | null,
  status = 200,
  description = 'Operación exitosa',
  isArray = false,
) {
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

  return applyDecorators(
    ApiExtraModels(...models),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [{ $ref: getSchemaPath(ApiResponseDto) }, { ...existingModel }],
      },
    }),
  );
}
