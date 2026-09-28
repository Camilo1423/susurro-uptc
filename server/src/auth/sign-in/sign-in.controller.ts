import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ApiResponseDto } from '../../shared/dtos/index.js';
import {
  ApiErrorResponse,
  ApiStandardResponse,
} from '../../shared/decorators/index.js';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from '../../shared/modules/tokens/index.js';
import type { Request } from '../../shared/types/request.js';
import { SignInService } from './sign-in.service.js';
import { AuthUserWebDto } from './dto/sign-in.dto.js';
import { SignInDto } from './dto/response/sign-in-response.dto.js';
import { SignIn, UserBase } from '../interfaces/sign-in.interface.js';

/** Ruta a la que se restringe la cookie de refresh (coincide con el endpoint). */
const REFRESH_COOKIE_PATH = '/api/v1/auth';

@ApiTags('auth')
@Controller('v1/auth')
export class SignInController {
  private readonly _domain: string;
  private readonly _cookieSecure: boolean;

  constructor(
    private readonly signInService: SignInService,
    private readonly configService: ConfigService,
  ) {
    this._domain = configService.getOrThrow<string>('domain');
    this._cookieSecure = configService.getOrThrow<boolean>('cookieSecure');
  }

  private _getCookieOptions(maxAge: number, path = '/') {
    const isLocalhost = this._domain === 'localhost';
    const sameSite: 'none' | 'lax' = this._cookieSecure ? 'none' : 'lax';
    return {
      httpOnly: true,
      secure: this._cookieSecure,
      sameSite,
      domain: isLocalhost ? undefined : this._domain,
      maxAge,
      path,
    };
  }

  private _setAuthCookies(
    res: Response,
    tokens: {
      access_tk: string;
      refresh_tk: string;
      time_to_access_token_expires: number;
      time_to_refresh_token_expires: number;
    },
  ) {
    res.cookie(
      'access_token',
      tokens.access_tk,
      this._getCookieOptions(tokens.time_to_access_token_expires),
    );
    res.cookie(
      'refresh_token',
      tokens.refresh_tk,
      this._getCookieOptions(
        tokens.time_to_refresh_token_expires,
        REFRESH_COOKIE_PATH,
      ),
    );
  }

  private _clearAuthCookies(res: Response) {
    const base = this._getCookieOptions(0);
    res.clearCookie('access_token', base);
    res.clearCookie('refresh_token', { ...base, path: REFRESH_COOKIE_PATH });
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiBody({ type: AuthUserWebDto })
  @ApiStandardResponse(SignInDto, HttpStatus.CREATED, 'Inicio de sesión exitoso')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Credenciales inválidas')
  async signIn(
    @Body() signInDto: AuthUserWebDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<SignIn>> {
    try {
      const response = await this.signInService.signIn(
        signInDto,
        req.ip ?? '',
        req.headers['user-agent'] ?? '',
      );

      const { tokens, ...user } = response;
      this._setAuthCookies(res, tokens);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Inicio de sesión exitoso',
        data: user,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh-token')
  @Get('/refresh-token')
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiStandardResponse(null, HttpStatus.OK, 'Token renovado')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<object>> {
    try {
      const { sub, jti, session_id } = req.user;
      if (!sub || !jti) {
        throw new InternalServerErrorException('Datos de token inválidos');
      }

      const tokens = await this.signInService.refreshToken(
        jti,
        session_id,
        sub,
        req.ip ?? '',
        req.headers['user-agent'] ?? '',
      );

      res.cookie(
        'access_token',
        tokens.accessToken,
        this._getCookieOptions(tokens.timeToAccessTokenExpires),
      );
      res.cookie(
        'refresh_token',
        tokens.refreshToken,
        this._getCookieOptions(
          tokens.timeToRefreshTokenExpires,
          REFRESH_COOKIE_PATH,
        ),
      );

      return { statusCode: 200, message: 'Token renovado exitosamente', data: {} };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al renovar token');
    }
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @Get('/who-am-i')
  @ApiOperation({ summary: 'Información del usuario actual' })
  @ApiStandardResponse(SignInDto, HttpStatus.OK, 'Usuario obtenido')
  async whoAmI(@Req() req: Request): Promise<ApiResponseDto<UserBase>> {
    try {
      const { sub, session_id } = req.user;
      if (!sub) {
        throw new InternalServerErrorException('Datos de token inválidos');
      }

      const resp = await this.signInService.whoAmI(
        session_id,
        sub,
        req.ip ?? '',
        req.headers['user-agent'] ?? '',
      );
      return { statusCode: 200, message: 'Usuario obtenido exitosamente', data: resp };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al obtener usuario');
    }
  }

  @Post('/sign-out')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiStandardResponse(null, HttpStatus.OK, 'Sesión cerrada')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<object>> {
    try {
      const { sub, jti, session_id } = req.user;
      if (sub && jti) {
        await this.signInService.invalidateSession(sub, session_id, jti);
      }
      this._clearAuthCookies(res);
      return { statusCode: 200, message: 'Sesión cerrada exitosamente', data: {} };
    } catch (error) {
      this._clearAuthCookies(res);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al cerrar sesión');
    }
  }
}
