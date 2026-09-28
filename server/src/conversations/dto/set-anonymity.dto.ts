import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

/** Activa/desactiva MI anonimidad en la conversación. */
export class SetAnonymityDto {
  @ApiProperty({
    description: 'true = me muestro anónimo (el otro ve mi alias); false = ve mi identidad',
    example: true,
  })
  @IsBoolean({ message: 'anonymous debe ser booleano' })
  anonymous: boolean;
}
