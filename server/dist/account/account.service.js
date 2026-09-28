var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AccountService_1;
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { toUserSession } from '../auth/user-session.mapper.js';
import { PROFILE_UPDATED, } from '../shared/events/profile.events.js';
let AccountService = AccountService_1 = class AccountService {
    prisma;
    eventEmitter;
    logger = new Logger(AccountService_1.name);
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async updateInfo(userId, dto) {
        try {
            if (dto.documentTypeId) {
                const documentType = await this.prisma.documentType.findUnique({
                    where: { id: dto.documentTypeId },
                    select: { id: true },
                });
                if (!documentType) {
                    throw new BadRequestException('El tipo de documento no existe');
                }
            }
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: { ...dto },
                include: {
                    documentType: { select: { code: true, name: true } },
                    avatars: { select: { type: true, url: true } },
                },
            });
            const nameChanged = dto.firstName !== undefined ||
                dto.secondName !== undefined ||
                dto.firstLastName !== undefined ||
                dto.secondLastName !== undefined;
            if (nameChanged) {
                this.eventEmitter.emit(PROFILE_UPDATED, {
                    userId,
                });
            }
            return toUserSession(user);
        }
        catch (error) {
            this.logger.error('Error al actualizar datos personales:', error);
            throw error;
        }
    }
};
AccountService = AccountService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventEmitter2])
], AccountService);
export { AccountService };
//# sourceMappingURL=account.service.js.map