import { ApiResponseDto } from '../shared/dtos/index.js';
import type { Request } from '../shared/types/request.js';
import { SocketService } from './socket.service.js';
export declare class SocketController {
    private readonly socketService;
    constructor(socketService: SocketService);
    socketToken(req: Request): Promise<ApiResponseDto<unknown>>;
}
