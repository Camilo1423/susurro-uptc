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
import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post, } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiStandardResponse, } from '../../shared/decorators/index.js';
import { SignInDto } from '../sign-in/dto/response/sign-in-response.dto.js';
import { SignUpService } from './sign-up.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';
let SignUpController = class SignUpController {
    signUpService;
    constructor(signUpService) {
        this.signUpService = signUpService;
    }
    async signUp(dto) {
        try {
            const data = await this.signUpService.signUp(dto);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Usuario registrado exitosamente',
                data,
            };
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al registrar usuario');
        }
    }
};
__decorate([
    Post('/sign-up'),
    ApiOperation({ summary: 'Registro de usuario (queda activo y confirmado)' }),
    ApiStandardResponse(SignInDto, HttpStatus.CREATED, 'Usuario registrado'),
    ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos'),
    ApiErrorResponse(HttpStatus.CONFLICT, 'Correo o usuario ya en uso'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignUpDto]),
    __metadata("design:returntype", Promise)
], SignUpController.prototype, "signUp", null);
SignUpController = __decorate([
    ApiTags('auth'),
    Controller('v1/auth'),
    __metadata("design:paramtypes", [SignUpService])
], SignUpController);
export { SignUpController };
//# sourceMappingURL=sign-up.controller.js.map