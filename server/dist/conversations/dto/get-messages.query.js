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
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
export class GetMessagesQuery {
    before;
    limit;
}
__decorate([
    ApiPropertyOptional({
        description: 'Id del mensaje más antiguo ya cargado (trae los anteriores a él)',
    }),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], GetMessagesQuery.prototype, "before", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Cantidad a traer (1-100)', default: 30 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], GetMessagesQuery.prototype, "limit", void 0);
//# sourceMappingURL=get-messages.query.js.map