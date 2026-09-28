var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SignUpService_1;
import { BadRequestException, ConflictException, Injectable, Logger, } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../shared/modules/prisma/index.js';
import { generatePin } from '../../shared/utils/pin.util.js';
import { toUserSession } from '../user-session.mapper.js';
const BCRYPT_ROUNDS = 10;
const PIN_MAX_ATTEMPTS = 5;
let SignUpService = SignUpService_1 = class SignUpService {
    prisma;
    logger = new Logger(SignUpService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async _generateUniquePin() {
        for (let i = 0; i < PIN_MAX_ATTEMPTS; i++) {
            const pin = generatePin();
            const existing = await this.prisma.user.findUnique({
                where: { pin },
                select: { id: true },
            });
            if (!existing)
                return pin;
        }
        throw new ConflictException('No se pudo generar un PIN único, intente de nuevo');
    }
    async signUp(dto) {
        try {
            const documentType = await this.prisma.documentType.findUnique({
                where: { id: dto.documentTypeId },
                select: { id: true },
            });
            if (!documentType) {
                throw new BadRequestException('El tipo de documento no existe');
            }
            const existing = await this.prisma.user.findFirst({
                where: { OR: [{ email: dto.email }, { username: dto.username }] },
                select: { email: true, username: true },
            });
            if (existing) {
                const field = existing.email === dto.email ? 'correo' : 'nombre de usuario';
                throw new ConflictException(`Ya existe un usuario con ese ${field}`);
            }
            const password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
            const pin = await this._generateUniquePin();
            const user = await this.prisma.user.create({
                data: {
                    ...dto,
                    password,
                    pin,
                    status: UserStatus.ACTIVE,
                    emailVerified: true,
                },
                include: {
                    documentType: { select: { code: true, name: true } },
                    avatars: { select: { type: true, url: true } },
                },
            });
            return toUserSession(user);
        }
        catch (error) {
            this.logger.error('Error al registrar usuario:', error);
            throw error;
        }
    }
};
SignUpService = SignUpService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SignUpService);
export { SignUpService };
//# sourceMappingURL=sign-up.service.js.map