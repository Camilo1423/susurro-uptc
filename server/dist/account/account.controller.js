var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, HttpStatus, Patch, Req, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiStandardResponse, } from '../shared/decorators/index.js';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import { SignInDto } from '../auth/sign-in/dto/response/sign-in-response.dto.js';
import { AccountService } from './account.service.js';
import { UpdateInfoDto } from './dto/update-info.dto.js';
let AccountController = class AccountController {
    accountService;
    constructor(accountService) {
        this.accountService = accountService;
    }
    async updateInfo(req, dto) {
        const data = await this.accountService.updateInfo(req.user.sub, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Datos actualizados exitosamente',
            data,
        };
    }
};
__decorate([
    Patch('update-info'),
    ApiOperation({ summary: 'Actualizar datos personales del usuario' }),
    ApiStandardResponse(SignInDto, HttpStatus.OK, 'Datos actualizados'),
    ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateInfoDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateInfo", null);
AccountController = __decorate([
    ApiTags('account'),
    ApiBearerAuth('access-token'),
    UseGuards(AccessTokenGuard),
    Controller('v1/account'),
    __metadata("design:paramtypes", [AccountService])
], AccountController);
export { AccountController };
//# sourceMappingURL=account.controller.js.map