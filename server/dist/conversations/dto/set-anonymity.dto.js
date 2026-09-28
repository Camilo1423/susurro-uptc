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
import { IsBoolean } from 'class-validator';
export class SetAnonymityDto {
    anonymous;
}
__decorate([
    ApiProperty({
        description: 'true = me muestro anónimo (el otro ve mi alias); false = ve mi identidad',
        example: true,
    }),
    IsBoolean({ message: 'anonymous debe ser booleano' }),
    __metadata("design:type", Boolean)
], SetAnonymityDto.prototype, "anonymous", void 0);
//# sourceMappingURL=set-anonymity.dto.js.map