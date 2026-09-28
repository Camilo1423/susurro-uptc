import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { UserBase } from '../auth/interfaces/sign-in.interface.js';
import { UpdateInfoDto } from './dto/update-info.dto.js';
export declare class AccountService {
    private readonly prisma;
    private readonly eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    updateInfo(userId: string, dto: UpdateInfoDto): Promise<UserBase>;
}
