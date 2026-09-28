var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches, MaxLength, } from 'class-validator';
import { CapitalizeWords, CapitalizeWordsNullable, MaxWords, Trim, TrimNullable, } from '../../shared/decorators/index.js';
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,100}$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;
export class UpdateInfoDto {
    firstName;
    secondName;
    firstLastName;
    secondLastName;
    phoneNumber;
    documentTypeId;
    documentNumber;
}
__decorate([
    ApiPropertyOptional({ description: 'Primer nombre', example: 'Andrés' }),
    IsOptional(),
    CapitalizeWords(),
    IsString({ message: 'El primer nombre debe ser una cadena de texto' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El primer nombre solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El primer nombre no debe exceder 1 palabra' }),
    __metadata("design:type", String)
], UpdateInfoDto.prototype, "firstName", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Segundo nombre (opcional; vacío lo limpia)',
        example: 'Camilo',
    }),
    IsOptional(),
    CapitalizeWordsNullable(),
    IsString({ message: 'El segundo nombre debe ser una cadena de texto' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El segundo nombre solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(2, { message: 'El segundo nombre no debe exceder 2 palabras' }),
    __metadata("design:type", Object)
], UpdateInfoDto.prototype, "secondName", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Primer apellido', example: 'Moreno' }),
    IsOptional(),
    CapitalizeWords(),
    IsString({ message: 'El primer apellido debe ser una cadena de texto' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El primer apellido solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El primer apellido no debe exceder 1 palabra' }),
    __metadata("design:type", String)
], UpdateInfoDto.prototype, "firstLastName", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Segundo apellido (opcional; vacío lo limpia)',
        example: 'Roa',
    }),
    IsOptional(),
    CapitalizeWordsNullable(),
    IsString({ message: 'El segundo apellido debe ser una cadena de texto' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El segundo apellido solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El segundo apellido no debe exceder 1 palabra' }),
    __metadata("design:type", Object)
], UpdateInfoDto.prototype, "secondLastName", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Número de teléfono (opcional; vacío lo limpia)',
        example: '+57 300 123 4567',
    }),
    IsOptional(),
    TrimNullable(),
    IsString({ message: 'El número de teléfono debe ser una cadena de texto' }),
    MaxLength(20),
    Matches(PHONE_REGEX, {
        message: 'El teléfono debe contener solo dígitos, espacios y símbolos (+ . - ( )), entre 7 y 20 caracteres',
    }),
    __metadata("design:type", Object)
], UpdateInfoDto.prototype, "phoneNumber", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'ID del tipo de documento',
        example: 'b3f1c2d4-...',
    }),
    IsOptional(),
    IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' }),
    __metadata("design:type", String)
], UpdateInfoDto.prototype, "documentTypeId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Número de documento', example: '1234567890' }),
    IsOptional(),
    Trim(),
    IsString({ message: 'El número de documento debe ser una cadena de texto' }),
    MaxLength(50),
    __metadata("design:type", String)
], UpdateInfoDto.prototype, "documentNumber", void 0);
//# sourceMappingURL=update-info.dto.js.map