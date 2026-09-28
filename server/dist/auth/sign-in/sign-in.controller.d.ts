import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ApiResponseDto } from '../../shared/dtos/index.js';
import type { Request } from '../../shared/types/request.js';
import { SignInService } from './sign-in.service.js';
import { AuthUserWebDto } from './dto/sign-in.dto.js';
import { SignIn, UserBase } from '../interfaces/sign-in.interface.js';
export declare class SignInController {
    private readonly signInService;
    private readonly configService;
    private readonly _domain;
    private readonly _cookieSecure;
    constructor(signInService: SignInService, configService: ConfigService);
    private _getCookieOptions;
    private _setAuthCookies;
    private _clearAuthCookies;
    signIn(signInDto: AuthUserWebDto, req: Request, res: Response): Promise<ApiResponseDto<SignIn>>;
    refreshToken(req: Request, res: Response): Promise<ApiResponseDto<object>>;
    whoAmI(req: Request): Promise<ApiResponseDto<UserBase>>;
    logout(req: Request, res: Response): Promise<ApiResponseDto<object>>;
}
