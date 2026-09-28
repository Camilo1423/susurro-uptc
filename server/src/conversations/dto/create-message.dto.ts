import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

/** Envía un mensaje dentro de una conversación (opcionalmente respondiendo a otro). */
export class CreateMessageDto {
  @ApiProperty({ description: 'Contenido del mensaje', example: 'Hola 👋' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1, { message: 'El mensaje no puede estar vacío' })
  @MaxLength(4000)
  content: string;

  @ApiPropertyOptional({
    description: 'Id del mensaje al que se responde (misma conversación)',
  })
  @IsOptional()
  @IsUUID()
  replyToId?: string;
}
