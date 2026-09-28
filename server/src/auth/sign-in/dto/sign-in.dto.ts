import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { TrimLowercase } from '../../../shared/decorators/index.js';

export class AuthUserWebDto {
  @ApiProperty({ description: 'Correo electrónico', example: 'usuario@uptc.edu.co' })
  @TrimLowercase()
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El correo electrónico no debe estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  readonly email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'ContraseñaSegura123' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía' })
  readonly password: string;
}
