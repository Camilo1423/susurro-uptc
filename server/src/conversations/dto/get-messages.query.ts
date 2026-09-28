import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

/** Paginación por cursor del historial de mensajes (hacia atrás). */
export class GetMessagesQuery {
  @ApiPropertyOptional({
    description: 'Id del mensaje más antiguo ya cargado (trae los anteriores a él)',
  })
  @IsOptional()
  @IsUUID()
  before?: string;

  @ApiPropertyOptional({ description: 'Cantidad a traer (1-100)', default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
