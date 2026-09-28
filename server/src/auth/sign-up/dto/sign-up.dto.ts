import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CapitalizeWords,
  CapitalizeWordsNullable,
  MaxWords,
  Trim,
  TrimLowercase,
  TrimNullable,
} from '../../../shared/decorators/index.js';

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,100}$/;
const USERNAME_REGEX = /^[A-Za-z0-9._-]{3,50}$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

/** Registro público de un usuario. */
export class SignUpDto {
  @ApiProperty({ example: 'usuario@uptc.edu.co' })
  @TrimLowercase()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'juanperez', description: 'Usuario único (3–50)' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @Matches(USERNAME_REGEX, {
    message:
      'El usuario solo permite letras, números, puntos, guiones y guiones bajos (3–50)',
  })
  username: string;

  @ApiProperty({ example: 'ContraseñaSegura123' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, { message: 'La contraseña no debe superar los 72 caracteres' })
  password: string;

  @ApiProperty({ example: 'Juan' })
  @CapitalizeWords()
  @IsString()
  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El primer nombre solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El primer nombre no debe exceder 1 palabra' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Camilo' })
  @IsOptional()
  @CapitalizeWordsNullable()
  @IsString()
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El segundo nombre solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(2, { message: 'El segundo nombre no debe exceder 2 palabras' })
  secondName?: string | null;

  @ApiProperty({ example: 'Pérez' })
  @CapitalizeWords()
  @IsString()
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El primer apellido solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El primer apellido no debe exceder 1 palabra' })
  firstLastName: string;

  @ApiPropertyOptional({ example: 'García' })
  @IsOptional()
  @CapitalizeWordsNullable()
  @IsString()
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El segundo apellido solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El segundo apellido no debe exceder 1 palabra' })
  secondLastName?: string | null;

  @ApiProperty({ example: 'uuid', description: 'ID del tipo de documento' })
  @IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  documentTypeId: string;

  @ApiProperty({ example: '1234567890' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @MaxLength(50)
  documentNumber: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsOptional()
  @TrimNullable()
  @IsString()
  @MaxLength(20)
  @Matches(PHONE_REGEX, {
    message:
      'El teléfono debe contener solo dígitos, espacios y símbolos (+ . - ( )), entre 7 y 20 caracteres',
  })
  phoneNumber?: string | null;
}
