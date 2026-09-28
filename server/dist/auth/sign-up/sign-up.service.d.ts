import { PrismaService } from '../../shared/modules/prisma/index.js';
import { UserBase } from '../interfaces/sign-in.interface.js';
import { SignUpDto } from './dto/sign-up.dto.js';
export declare class SignUpService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private _generateUniquePin;
    signUp(dto: SignUpDto): Promise<UserBase>;
}
