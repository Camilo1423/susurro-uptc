var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
export class SignInDto {
    id;
    email;
    username;
    firstName;
    secondName;
    firstLastName;
    secondLastName;
    documentTypeCode;
    documentType;
    documentNumber;
    pin;
    status;
    requireChangePassword;
    avatar;
}
__decorate([
    ApiProperty({ example: 'b3f1c2d4-...' }),
    __metadata("design:type", String)
], SignInDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'usuario@uptc.edu.co' }),
    __metadata("design:type", String)
], SignInDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: 'juanperez' }),
    __metadata("design:type", String)
], SignInDto.prototype, "username", void 0);
__decorate([
    ApiProperty({ example: 'Juan' }),
    __metadata("design:type", String)
], SignInDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({ example: 'Miguel', nullable: true }),
    __metadata("design:type", Object)
], SignInDto.prototype, "secondName", void 0);
__decorate([
    ApiProperty({ example: 'Pérez' }),
    __metadata("design:type", String)
], SignInDto.prototype, "firstLastName", void 0);
__decorate([
    ApiProperty({ example: 'García', nullable: true }),
    __metadata("design:type", Object)
], SignInDto.prototype, "secondLastName", void 0);
__decorate([
    ApiProperty({ example: 'CC' }),
    __metadata("design:type", String)
], SignInDto.prototype, "documentTypeCode", void 0);
__decorate([
    ApiProperty({ example: 'Cédula de ciudadanía' }),
    __metadata("design:type", String)
], SignInDto.prototype, "documentType", void 0);
__decorate([
    ApiProperty({ example: '1234567890' }),
    __metadata("design:type", String)
], SignInDto.prototype, "documentNumber", void 0);
__decorate([
    ApiProperty({ example: 'A3F92B7C', description: 'PIN de descubrimiento (único)' }),
    __metadata("design:type", String)
], SignInDto.prototype, "pin", void 0);
__decorate([
    ApiProperty({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], SignInDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ example: false }),
    __metadata("design:type", Boolean)
], SignInDto.prototype, "requireChangePassword", void 0);
__decorate([
    ApiProperty({
        description: 'Rutas del endpoint para ver las fotos (streaming, con validación); ' +
            'null si no hay foto',
        example: {
            thumbnail: '/api/v1/avatars/<id>?type=thumbnail',
            original: '/api/v1/avatars/<id>?type=original',
        },
    }),
    __metadata("design:type", Object)
], SignInDto.prototype, "avatar", void 0);
//# sourceMappingURL=sign-in-response.dto.js.map