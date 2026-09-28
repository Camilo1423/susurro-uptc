import { ApiResponseDto } from '../shared/dtos/index.js';
export declare class HealthController {
    check(): ApiResponseDto<{
        status: string;
    }>;
}
