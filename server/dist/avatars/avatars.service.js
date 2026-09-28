var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import sharp from 'sharp';
import { AvatarType } from '../generated/prisma/enums.js';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { BucketService } from '../shared/modules/bucket/index.js';
import { PROFILE_UPDATED, } from '../shared/events/profile.events.js';
const ORIGINAL_MAX = 1280;
const THUMB_SIZE = 256;
let AvatarsService = class AvatarsService {
    prisma;
    bucket;
    eventEmitter;
    constructor(prisma, bucket, eventEmitter) {
        this.prisma = prisma;
        this.bucket = bucket;
        this.eventEmitter = eventEmitter;
    }
    prefix(userId) {
        return `avatars/${userId}/`;
    }
    async upload(userId, file) {
        if (!file?.buffer?.length) {
            throw new BadRequestException('No se envió ninguna imagen');
        }
        if (!file.mimetype?.startsWith('image/')) {
            throw new BadRequestException('El archivo debe ser una imagen');
        }
        let originalBuffer;
        let thumbnailBuffer;
        try {
            [originalBuffer, thumbnailBuffer] = await Promise.all([
                sharp(file.buffer)
                    .rotate()
                    .resize({
                    width: ORIGINAL_MAX,
                    height: ORIGINAL_MAX,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                    .webp({ quality: 82 })
                    .toBuffer(),
                sharp(file.buffer)
                    .rotate()
                    .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: 'cover' })
                    .webp({ quality: 72 })
                    .toBuffer(),
            ]);
        }
        catch {
            throw new BadRequestException('No se pudo procesar la imagen');
        }
        await this.bucket.deleteByPrefix(this.prefix(userId));
        const originalKey = `${this.prefix(userId)}${userId}-original.webp`;
        const thumbnailKey = `${this.prefix(userId)}${userId}-thumbnail.webp`;
        await Promise.all([
            this.bucket.uploadItem(originalKey, originalBuffer, { acl: 'private' }),
            this.bucket.uploadItem(thumbnailKey, thumbnailBuffer, { acl: 'private' }),
        ]);
        const originalUrl = this.apiPath(userId, AvatarType.ORIGINAL);
        const thumbnailUrl = this.apiPath(userId, AvatarType.THUMBNAIL);
        await this.prisma.$transaction([
            this.prisma.userAvatar.upsert({
                where: { userId_type: { userId, type: AvatarType.ORIGINAL } },
                update: { key: originalKey, url: originalUrl },
                create: { userId, type: AvatarType.ORIGINAL, key: originalKey, url: originalUrl },
            }),
            this.prisma.userAvatar.upsert({
                where: { userId_type: { userId, type: AvatarType.THUMBNAIL } },
                update: { key: thumbnailKey, url: thumbnailUrl },
                create: {
                    userId,
                    type: AvatarType.THUMBNAIL,
                    key: thumbnailKey,
                    url: thumbnailUrl,
                },
            }),
        ]);
        this.eventEmitter.emit(PROFILE_UPDATED, { userId });
        return { thumbnail: thumbnailUrl, original: originalUrl };
    }
    async remove(userId) {
        await this.bucket.deleteByPrefix(this.prefix(userId));
        await this.prisma.userAvatar.deleteMany({ where: { userId } });
        this.eventEmitter.emit(PROFILE_UPDATED, { userId });
    }
    apiPath(userId, type) {
        const t = type === AvatarType.THUMBNAIL ? 'thumbnail' : 'original';
        return `/api/v1/avatars/${userId}?type=${t}`;
    }
    async canView(viewerId, targetId) {
        if (viewerId === targetId)
            return true;
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { userAId: viewerId, userBId: targetId },
                    { userAId: targetId, userBId: viewerId },
                ],
            },
            select: { userAId: true, anonymousA: true, anonymousB: true },
        });
        if (!conversation)
            return false;
        const targetIsUserA = conversation.userAId === targetId;
        const targetIsAnonymous = targetIsUserA
            ? conversation.anonymousA
            : conversation.anonymousB;
        return !targetIsAnonymous;
    }
    async getAvatarFile(viewerId, targetId, type) {
        const notFound = new NotFoundException('Avatar no disponible');
        if (!(await this.canView(viewerId, targetId)))
            throw notFound;
        const row = await this.prisma.userAvatar.findUnique({
            where: { userId_type: { userId: targetId, type } },
            select: { key: true },
        });
        if (!row)
            throw notFound;
        const buffer = await this.bucket.getItem(row.key);
        return { buffer, contentType: 'image/webp' };
    }
};
AvatarsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        BucketService,
        EventEmitter2])
], AvatarsService);
export { AvatarsService };
//# sourceMappingURL=avatars.service.js.map