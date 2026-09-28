import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  CapitalizeWords,
  CapitalizeWordsNullable,
  MaxWords,
  Trim,
  TrimNullable,
} from '../../shared/decorators/index.js';

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,100}$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

/**
 * Actualización de datos personales del usuario autenticado. Todos los campos
 * son opcionales (PATCH parcial): solo se actualiza lo que llegue. NO incluye
 * correo/usuario/contraseña (son credenciales y van en flujos dedicados).
 */
export class UpdateInfoDto {
  @ApiPropertyOptional({ description: 'Primer nombre', example: 'Andrés' })
  @IsOptional()
  @CapitalizeWords()
  @IsString({ message: 'El primer nombre debe ser una cadena de texto' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El primer nombre solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El primer nombre no debe exceder 1 palabra' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre (opcional; vacío lo limpia)',
    example: 'Camilo',
  })
  @IsOptional()
  @CapitalizeWordsNullable()
  @IsString({ message: 'El segundo nombre debe ser una cadena de texto' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El segundo nombre solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(2, { message: 'El segundo nombre no debe exceder 2 palabras' })
  secondName?: string | null;

  @ApiPropertyOptional({ description: 'Primer apellido', example: 'Moreno' })
  @IsOptional()
  @CapitalizeWords()
  @IsString({ message: 'El primer apellido debe ser una cadena de texto' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El primer apellido solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El primer apellido no debe exceder 1 palabra' })
  firstLastName?: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido (opcional; vacío lo limpia)',
    example: 'Roa',
  })
  @IsOptional()
  @CapitalizeWordsNullable()
  @IsString({ message: 'El segundo apellido debe ser una cadena de texto' })
  @MaxLength(100)
  @Matches(NAME_REGEX, {
    message: 'El segundo apellido solo permite letras, espacios y símbolos simples',
  })
  @MaxWords(1, { message: 'El segundo apellido no debe exceder 1 palabra' })
  secondLastName?: string | null;

  @ApiPropertyOptional({
    description: 'Número de teléfono (opcional; vacío lo limpia)',
    example: '+57 300 123 4567',
  })
  @IsOptional()
  @TrimNullable()
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto' })
  @MaxLength(20)
  @Matches(PHONE_REGEX, {
    message:
      'El teléfono debe contener solo dígitos, espacios y símbolos (+ . - ( )), entre 7 y 20 caracteres',
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    description: 'ID del tipo de documento',
    example: 'b3f1c2d4-...',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' })
  documentTypeId?: string;

  @ApiPropertyOptional({ description: 'Número de documento', example: '1234567890' })
  @IsOptional()
  @Trim()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MaxLength(50)
  documentNumber?: string;
}
