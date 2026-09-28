import type { Response } from 'express';
import { ApiResponseDto } from '../shared/dtos/index.js';
import type { Request } from '../shared/types/request.js';
import { AvatarsService, type AvatarUrls } from './avatars.service.js';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
    upload(req: Request, file: Express.Multer.File): Promise<ApiResponseDto<AvatarUrls>>;
    view(req: Request, userId: string, type: string | undefined, res: Response): Promise<void>;
    remove(req: Request): Promise<ApiResponseDto<object>>;
}
