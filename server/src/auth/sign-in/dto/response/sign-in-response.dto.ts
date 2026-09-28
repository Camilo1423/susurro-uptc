import { ApiProperty } from '@nestjs/swagger';

/** Forma del usuario devuelto por sign-in / who-am-i (documentación Swagger). */
export class SignInDto {
  @ApiProperty({ example: 'b3f1c2d4-...' })
  id: string;

  @ApiProperty({ example: 'usuario@uptc.edu.co' })
  email: string;

  @ApiProperty({ example: 'juanperez' })
  username: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Miguel', nullable: true })
  secondName: string | null;

  @ApiProperty({ example: 'Pérez' })
  firstLastName: string;

  @ApiProperty({ example: 'García', nullable: true })
  secondLastName: string | null;

  @ApiProperty({ example: 'CC' })
  documentTypeCode: string;

  @ApiProperty({ example: 'Cédula de ciudadanía' })
  documentType: string;

  @ApiProperty({ example: '1234567890' })
  documentNumber: string;

  @ApiProperty({ example: 'A3F92B7C', description: 'PIN de descubrimiento (único)' })
  pin: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: false })
  requireChangePassword: boolean;

  @ApiProperty({
    description:
      'Rutas del endpoint para ver las fotos (streaming, con validación); ' +
      'null si no hay foto',
    example: {
      thumbnail: '/api/v1/avatars/<id>?type=thumbnail',
      original: '/api/v1/avatars/<id>?type=original',
    },
  })
  avatar: { thumbnail: string | null; original: string | null };
}
