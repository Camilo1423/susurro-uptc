import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Inicia una conversación con el usuario dueño del PIN. */
export class CreateConversationDto {
  @ApiProperty({
    description: 'PIN de descubrimiento del otro usuario (se ignoran guiones/espacios)',
    example: '8D3E-B850',
  })
  // Normaliza: quita guiones/espacios y pasa a mayúsculas (así "8D3E-B850" == "8D3EB850").
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'El PIN es obligatorio' })
  @MaxLength(32)
  pin: string;
}
