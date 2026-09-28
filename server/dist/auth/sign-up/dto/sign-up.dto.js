var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength, } from 'class-validator';
import { CapitalizeWords, CapitalizeWordsNullable, MaxWords, Trim, TrimLowercase, TrimNullable, } from '../../../shared/decorators/index.js';
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,100}$/;
const USERNAME_REGEX = /^[A-Za-z0-9._-]{3,50}$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;
export class SignUpDto {
    email;
    username;
    password;
    firstName;
    secondName;
    firstLastName;
    secondLastName;
    documentTypeId;
    documentNumber;
    phoneNumber;
}
__decorate([
    ApiProperty({ example: 'usuario@uptc.edu.co' }),
    TrimLowercase(),
    IsEmail({}, { message: 'El correo electrónico debe ser válido' }),
    IsNotEmpty({ message: 'El correo electrónico es obligatorio' }),
    MaxLength(255),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: 'juanperez', description: 'Usuario único (3–50)' }),
    Trim(),
    IsString(),
    IsNotEmpty({ message: 'El nombre de usuario es obligatorio' }),
    Matches(USERNAME_REGEX, {
        message: 'El usuario solo permite letras, números, puntos, guiones y guiones bajos (3–50)',
    }),
    __metadata("design:type", String)
], SignUpDto.prototype, "username", void 0);
__decorate([
    ApiProperty({ example: 'ContraseñaSegura123' }),
    IsString(),
    IsNotEmpty({ message: 'La contraseña es obligatoria' }),
    MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    MaxLength(72, { message: 'La contraseña no debe superar los 72 caracteres' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ example: 'Juan' }),
    CapitalizeWords(),
    IsString(),
    IsNotEmpty({ message: 'El primer nombre es obligatorio' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El primer nombre solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El primer nombre no debe exceder 1 palabra' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "firstName", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Camilo' }),
    IsOptional(),
    CapitalizeWordsNullable(),
    IsString(),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El segundo nombre solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(2, { message: 'El segundo nombre no debe exceder 2 palabras' }),
    __metadata("design:type", Object)
], SignUpDto.prototype, "secondName", void 0);
__decorate([
    ApiProperty({ example: 'Pérez' }),
    CapitalizeWords(),
    IsString(),
    IsNotEmpty({ message: 'El primer apellido es obligatorio' }),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El primer apellido solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El primer apellido no debe exceder 1 palabra' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "firstLastName", void 0);
__decorate([
    ApiPropertyOptional({ example: 'García' }),
    IsOptional(),
    CapitalizeWordsNullable(),
    IsString(),
    MaxLength(100),
    Matches(NAME_REGEX, {
        message: 'El segundo apellido solo permite letras, espacios y símbolos simples',
    }),
    MaxWords(1, { message: 'El segundo apellido no debe exceder 1 palabra' }),
    __metadata("design:type", Object)
], SignUpDto.prototype, "secondLastName", void 0);
__decorate([
    ApiProperty({ example: 'uuid', description: 'ID del tipo de documento' }),
    IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' }),
    IsNotEmpty({ message: 'El tipo de documento es obligatorio' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "documentTypeId", void 0);
__decorate([
    ApiProperty({ example: '1234567890' }),
    Trim(),
    IsString(),
    IsNotEmpty({ message: 'El número de documento es obligatorio' }),
    MaxLength(50),
    __metadata("design:type", String)
], SignUpDto.prototype, "documentNumber", void 0);
__decorate([
    ApiPropertyOptional({ example: '+57 300 123 4567' }),
    IsOptional(),
    TrimNullable(),
    IsString(),
    MaxLength(20),
    Matches(PHONE_REGEX, {
        message: 'El teléfono debe contener solo dígitos, espacios y símbolos (+ . - ( )), entre 7 y 20 caracteres',
    }),
    __metadata("design:type", Object)
], SignUpDto.prototype, "phoneNumber", void 0);
//# sourceMappingURL=sign-up.dto.js.map