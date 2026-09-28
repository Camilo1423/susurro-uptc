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
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateConversationDto {
    pin;
}
__decorate([
    ApiProperty({
        description: 'PIN de descubrimiento del otro usuario (se ignoran guiones/espacios)',
        example: '8D3E-B850',
    }),
    Transform(({ value }) => typeof value === 'string'
        ? value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
        : value),
    IsString(),
    IsNotEmpty({ message: 'El PIN es obligatorio' }),
    MaxLength(32),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "pin", void 0);
//# sourceMappingURL=create-conversation.dto.js.map