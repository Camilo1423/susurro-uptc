var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiTags, } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AvatarType } from '../generated/prisma/enums.js';
import { AccessTokenGuard, AccessTokenLenientGuard, } from '../shared/modules/tokens/index.js';
import { AvatarsService } from './avatars.service.js';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let AvatarsController = class AvatarsController {
    avatarsService;
    constructor(avatarsService) {
        this.avatarsService = avatarsService;
    }
    async upload(req, file) {
        const data = await this.avatarsService.upload(req.user.sub, file);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Foto de perfil actualizada',
            data,
        };
    }
    async view(req, userId, type, res) {
        const avatarType = type === 'thumbnail' ? AvatarType.THUMBNAIL : AvatarType.ORIGINAL;
        const { buffer, contentType } = await this.avatarsService.getAvatarFile(req.user.sub, userId, avatarType);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.send(buffer);
    }
    async remove(req) {
        await this.avatarsService.remove(req.user.sub);
        return {
            statusCode: HttpStatus.OK,
            message: 'Foto de perfil eliminada',
            data: {},
        };
    }
};
__decorate([
    Post(),
    UseGuards(AccessTokenGuard),
    ApiOperation({ summary: 'Subir/reemplazar la foto de perfil' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    }),
    UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: MAX_FILE_SIZE },
    })),
    __param(0, Req()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "upload", null);
__decorate([
    Get(':userId'),
    UseGuards(AccessTokenLenientGuard),
    ApiOperation({
        summary: 'Ver (streaming) el avatar de un usuario — el propio siempre; de otro ' +
            'solo si hay conversación y no está en modo anónimo. ?type=thumbnail|original',
    }),
    ApiProduces('image/webp'),
    __param(0, Req()),
    __param(1, Param('userId', ParseUUIDPipe)),
    __param(2, Query('type')),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "view", null);
__decorate([
    Delete(),
    UseGuards(AccessTokenGuard),
    ApiOperation({ summary: 'Eliminar la foto de perfil' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "remove", null);
AvatarsController = __decorate([
    ApiTags('avatars'),
    ApiBearerAuth('access-token'),
    Controller('v1/avatars'),
    __metadata("design:paramtypes", [AvatarsService])
], AvatarsController);
export { AvatarsController };
//# sourceMappingURL=avatars.controller.js.map