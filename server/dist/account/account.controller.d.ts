import { ApiResponseDto } from '../shared/dtos/index.js';
import type { Request } from '../shared/types/request.js';
import type { UserBase } from '../auth/interfaces/sign-in.interface.js';
import { AccountService } from './account.service.js';
import { UpdateInfoDto } from './dto/update-info.dto.js';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    updateInfo(req: Request, dto: UpdateInfoDto): Promise<ApiResponseDto<UserBase>>;
}
