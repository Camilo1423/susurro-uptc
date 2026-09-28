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
import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiStandardResponse, } from '../../shared/decorators/index.js';
import { AccessTokenGuard, RefreshTokenGuard, } from '../../shared/modules/tokens/index.js';
import { SignInService } from './sign-in.service.js';
import { AuthUserWebDto } from './dto/sign-in.dto.js';
import { SignInDto } from './dto/response/sign-in-response.dto.js';
const REFRESH_COOKIE_PATH = '/api/v1/auth';
let SignInController = class SignInController {
    signInService;
    configService;
    _domain;
    _cookieSecure;
    constructor(signInService, configService) {
        this.signInService = signInService;
        this.configService = configService;
        this._domain = configService.getOrThrow('domain');
        this._cookieSecure = configService.getOrThrow('cookieSecure');
    }
    _getCookieOptions(maxAge, path = '/') {
        const isLocalhost = this._domain === 'localhost';
        const sameSite = this._cookieSecure ? 'none' : 'lax';
        return {
            httpOnly: true,
            secure: this._cookieSecure,
            sameSite,
            domain: isLocalhost ? undefined : this._domain,
            maxAge,
            path,
        };
    }
    _setAuthCookies(res, tokens) {
        res.cookie('access_token', tokens.access_tk, this._getCookieOptions(tokens.time_to_access_token_expires));
        res.cookie('refresh_token', tokens.refresh_tk, this._getCookieOptions(tokens.time_to_refresh_token_expires, REFRESH_COOKIE_PATH));
    }
    _clearAuthCookies(res) {
        const base = this._getCookieOptions(0);
        res.clearCookie('access_token', base);
        res.clearCookie('refresh_token', { ...base, path: REFRESH_COOKIE_PATH });
    }
    async signIn(signInDto, req, res) {
        try {
            const response = await this.signInService.signIn(signInDto, req.ip ?? '', req.headers['user-agent'] ?? '');
            const { tokens, ...user } = response;
            this._setAuthCookies(res, tokens);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Inicio de sesión exitoso',
                data: user,
            };
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al iniciar sesión');
        }
    }
    async refreshToken(req, res) {
        try {
            const { sub, jti, session_id } = req.user;
            if (!sub || !jti) {
                throw new InternalServerErrorException('Datos de token inválidos');
            }
            const tokens = await this.signInService.refreshToken(jti, session_id, sub, req.ip ?? '', req.headers['user-agent'] ?? '');
            res.cookie('access_token', tokens.accessToken, this._getCookieOptions(tokens.timeToAccessTokenExpires));
            res.cookie('refresh_token', tokens.refreshToken, this._getCookieOptions(tokens.timeToRefreshTokenExpires, REFRESH_COOKIE_PATH));
            return { statusCode: 200, message: 'Token renovado exitosamente', data: {} };
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al renovar token');
        }
    }
    async whoAmI(req) {
        try {
            const { sub, session_id } = req.user;
            if (!sub) {
                throw new InternalServerErrorException('Datos de token inválidos');
            }
            const resp = await this.signInService.whoAmI(session_id, sub, req.ip ?? '', req.headers['user-agent'] ?? '');
            return { statusCode: 200, message: 'Usuario obtenido exitosamente', data: resp };
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al obtener usuario');
        }
    }
    async logout(req, res) {
        try {
            const { sub, jti, session_id } = req.user;
            if (sub && jti) {
                await this.signInService.invalidateSession(sub, session_id, jti);
            }
            this._clearAuthCookies(res);
            return { statusCode: 200, message: 'Sesión cerrada exitosamente', data: {} };
        }
        catch (error) {
            this._clearAuthCookies(res);
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException('Error al cerrar sesión');
        }
    }
};
__decorate([
    Post('/sign-in'),
    ApiOperation({ summary: 'Inicio de sesión' }),
    ApiBody({ type: AuthUserWebDto }),
    ApiStandardResponse(SignInDto, HttpStatus.CREATED, 'Inicio de sesión exitoso'),
    ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Credenciales inválidas'),
    __param(0, Body()),
    __param(1, Req()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthUserWebDto, Object, Object]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signIn", null);
__decorate([
    UseGuards(RefreshTokenGuard),
    ApiBearerAuth('refresh-token'),
    Get('/refresh-token'),
    ApiOperation({ summary: 'Renovar access token' }),
    ApiStandardResponse(null, HttpStatus.OK, 'Token renovado'),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "refreshToken", null);
__decorate([
    UseGuards(AccessTokenGuard),
    ApiBearerAuth('access-token'),
    Get('/who-am-i'),
    ApiOperation({ summary: 'Información del usuario actual' }),
    ApiStandardResponse(SignInDto, HttpStatus.OK, 'Usuario obtenido'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "whoAmI", null);
__decorate([
    Post('/sign-out'),
    UseGuards(RefreshTokenGuard),
    ApiBearerAuth('refresh-token'),
    ApiOperation({ summary: 'Cerrar sesión' }),
    ApiStandardResponse(null, HttpStatus.OK, 'Sesión cerrada'),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "logout", null);
SignInController = __decorate([
    ApiTags('auth'),
    Controller('v1/auth'),
    __metadata("design:paramtypes", [SignInService,
        ConfigService])
], SignInController);
export { SignInController };
//# sourceMappingURL=sign-in.controller.js.map