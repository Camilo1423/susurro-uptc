import { ApiResponseDto } from '../../shared/dtos/index.js';
import type { UserBase } from '../interfaces/sign-in.interface.js';
import { SignUpService } from './sign-up.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';
export declare class SignUpController {
    private readonly signUpService;
    constructor(signUpService: SignUpService);
    signUp(dto: SignUpDto): Promise<ApiResponseDto<UserBase>>;
}
