var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConversationsService_1;
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AvatarType, UserStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { CONVERSATION_COUNTERPART_UPDATED, CONVERSATION_CREATED, CONVERSATION_DELETED, } from '../shared/events/conversation.events.js';
import { PROFILE_UPDATED, } from '../shared/events/profile.events.js';
import { CONVERSATION_PRESENCE, PRESENCE_CHANGED, } from '../shared/events/presence.events.js';
import { CONVERSATION_TYPING, TYPING_SIGNAL, } from '../shared/events/typing.events.js';
import { MESSAGES_READ, MESSAGE_CREATED, } from '../shared/events/message.events.js';
import { PresenceService } from '../shared/providers/presence/index.js';
import { generateAliasPair } from '../shared/utils/alias.util.js';
const PARTICIPANT_SELECT = {
    id: true,
    firstName: true,
    secondName: true,
    firstLastName: true,
    secondLastName: true,
    avatars: { select: { type: true, updatedAt: true } },
};
const DETAIL_INCLUDE = {
    userA: { select: PARTICIPANT_SELECT },
    userB: { select: PARTICIPANT_SELECT },
};
const MESSAGE_SELECT = {
    id: true,
    content: true,
    senderId: true,
    readAt: true,
    createdAt: true,
    replyTo: { select: { id: true, content: true, senderId: true } },
};
let ConversationsService = ConversationsService_1 = class ConversationsService {
    prisma;
    eventEmitter;
    presence;
    logger = new Logger(ConversationsService_1.name);
    constructor(prisma, eventEmitter, presence) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.presence = presence;
    }
    avatarPath(userId, type, updatedAt) {
        return `/api/v1/avatars/${userId}?type=${type}&v=${updatedAt.getTime()}`;
    }
    async createByPin(userId, dto) {
        const target = await this.prisma.user.findUnique({
            where: { pin: dto.pin },
            select: { id: true },
        });
        if (!target) {
            throw new InternalServerErrorException('Algo pasó, estamos trabajando para arreglar el error.');
        }
        if (target.id === userId) {
            throw new BadRequestException('No puedes iniciar un chat contigo mismo.');
        }
        return this._startConversation(userId, target.id);
    }
    async _startConversation(userId, targetId) {
        const [userAId, userBId] = userId < targetId ? [userId, targetId] : [targetId, userId];
        const existing = await this.prisma.conversation.findUnique({
            where: { userAId_userBId: { userAId, userBId } },
            select: { id: true },
        });
        if (existing) {
            return { conversationId: existing.id, created: false };
        }
        const [aliasA, aliasB] = generateAliasPair();
        const conversation = await this.prisma.conversation.create({
            data: { userAId, userBId, aliasA, aliasB },
            include: DETAIL_INCLUDE,
        });
        const payload = {
            targetUserId: targetId,
            item: this.buildListItem(conversation, targetId, null, 0),
        };
        this.eventEmitter.emit(CONVERSATION_CREATED, payload);
        return { conversationId: conversation.id, created: true };
    }
    async startRandom(userId) {
        const myConversations = await this.prisma.conversation.findMany({
            where: { OR: [{ userAId: userId }, { userBId: userId }] },
            select: { userAId: true, userBId: true },
        });
        const excluded = new Set([userId]);
        for (const c of myConversations) {
            excluded.add(c.userAId);
            excluded.add(c.userBId);
        }
        const candidates = await this.prisma.user.findMany({
            where: { id: { notIn: [...excluded] }, status: UserStatus.ACTIVE },
            select: { id: true },
        });
        if (candidates.length === 0) {
            throw new NotFoundException('No encontramos usuarios disponibles para un chat aleatorio por ahora.');
        }
        const online = candidates.filter((c) => this.presence.isOnline(c.id));
        const pool = online.length > 0 ? online : candidates;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        const warnOffline = online.length === 0;
        const result = await this._startConversation(userId, chosen.id);
        return { ...result, warnOffline };
    }
    async _findForParticipant(userId, conversationId) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [{ userAId: userId }, { userBId: userId }],
            },
            include: DETAIL_INCLUDE,
        });
        if (!conversation) {
            throw new NotFoundException('Conversación no encontrada');
        }
        return conversation;
    }
    buildCounterpartView(conversation, viewerId) {
        const iAmUserA = conversation.userAId === viewerId;
        const counterpart = iAmUserA ? conversation.userB : conversation.userA;
        const counterpartAlias = iAmUserA
            ? conversation.aliasB
            : conversation.aliasA;
        const counterpartAnonymous = iAmUserA
            ? conversation.anonymousB
            : conversation.anonymousA;
        const fullName = [
            counterpart.firstName,
            counterpart.secondName,
            counterpart.firstLastName,
            counterpart.secondLastName,
        ]
            .filter(Boolean)
            .join(' ');
        const thumb = counterpart.avatars.find((a) => a.type === AvatarType.THUMBNAIL);
        const original = counterpart.avatars.find((a) => a.type === AvatarType.ORIGINAL);
        return {
            isAnonymous: counterpartAnonymous,
            displayName: counterpartAnonymous ? counterpartAlias : fullName,
            avatarThumbnail: counterpartAnonymous || !thumb
                ? null
                : this.avatarPath(counterpart.id, 'thumbnail', thumb.updatedAt),
            avatarOriginal: counterpartAnonymous || !original
                ? null
                : this.avatarPath(counterpart.id, 'original', original.updatedAt),
        };
    }
    buildListItem(conversation, viewerId, last, unreadCount) {
        const iAmUserA = conversation.userAId === viewerId;
        const counterpart = iAmUserA ? conversation.userB : conversation.userA;
        const counterpartAlias = iAmUserA
            ? conversation.aliasB
            : conversation.aliasA;
        const counterpartAnonymous = iAmUserA
            ? conversation.anonymousB
            : conversation.anonymousA;
        const fullName = [
            counterpart.firstName,
            counterpart.secondName,
            counterpart.firstLastName,
            counterpart.secondLastName,
        ]
            .filter(Boolean)
            .join(' ');
        const thumb = counterpart.avatars.find((a) => a.type === AvatarType.THUMBNAIL);
        return {
            conversationId: conversation.id,
            isAnonymous: counterpartAnonymous,
            displayName: counterpartAnonymous ? counterpartAlias : fullName,
            avatar: counterpartAnonymous || !thumb
                ? null
                : this.avatarPath(counterpart.id, 'thumbnail', thumb.updatedAt),
            lastMessage: last
                ? {
                    content: last.content,
                    createdAt: last.createdAt,
                    fromMe: last.senderId === viewerId,
                    readAt: last.readAt,
                }
                : null,
            unreadCount,
            lastActivityAt: last?.createdAt ?? conversation.lastMessageAt ?? conversation.createdAt,
            online: this.presence.isOnline(counterpart.id),
        };
    }
    buildDetail(conversation, userId) {
        const iAmUserA = conversation.userAId === userId;
        const myAlias = iAmUserA ? conversation.aliasA : conversation.aliasB;
        const myAnonymous = iAmUserA
            ? conversation.anonymousA
            : conversation.anonymousB;
        const view = this.buildCounterpartView(conversation, userId);
        return {
            conversationId: conversation.id,
            counterpart: {
                isAnonymous: view.isAnonymous,
                displayName: view.displayName,
                avatar: view.avatarOriginal,
            },
            me: {
                isAnonymous: myAnonymous,
                alias: myAlias,
            },
            createdAt: conversation.createdAt,
            lastActivityAt: conversation.lastMessageAt,
        };
    }
    async getDetail(userId, conversationId) {
        const conversation = await this._findForParticipant(userId, conversationId);
        return this.buildDetail(conversation, userId);
    }
    async setMyAnonymity(userId, conversationId, anonymous) {
        const conversation = await this._findForParticipant(userId, conversationId);
        const iAmUserA = conversation.userAId === userId;
        const updated = await this.prisma.conversation.update({
            where: { id: conversation.id },
            data: iAmUserA ? { anonymousA: anonymous } : { anonymousB: anonymous },
            include: DETAIL_INCLUDE,
        });
        const counterpartId = iAmUserA ? updated.userBId : updated.userAId;
        const payload = {
            targetUserId: counterpartId,
            conversationId: updated.id,
            counterpart: this.buildCounterpartView(updated, counterpartId),
        };
        this.eventEmitter.emit(CONVERSATION_COUNTERPART_UPDATED, payload);
        return this.buildDetail(updated, userId);
    }
    async deleteConversation(userId, conversationId) {
        const conversation = await this._findForParticipant(userId, conversationId);
        const counterpartId = conversation.userAId === userId
            ? conversation.userBId
            : conversation.userAId;
        await this.prisma.$transaction([
            this.prisma.message.deleteMany({ where: { conversationId } }),
            this.prisma.conversation.delete({ where: { id: conversationId } }),
        ]);
        const payload = {
            targetUserId: counterpartId,
            conversationId,
        };
        this.eventEmitter.emit(CONVERSATION_DELETED, payload);
    }
    async _assertParticipant(userId, conversationId) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [{ userAId: userId }, { userBId: userId }],
            },
            select: { id: true, userAId: true, userBId: true },
        });
        if (!conversation) {
            throw new NotFoundException('Conversación no encontrada');
        }
        return conversation;
    }
    buildMessageView(message, viewerId) {
        return {
            id: message.id,
            content: message.content,
            fromMe: message.senderId === viewerId,
            createdAt: message.createdAt,
            readAt: message.readAt,
            replyTo: message.replyTo
                ? {
                    id: message.replyTo.id,
                    content: message.replyTo.content,
                    fromMe: message.replyTo.senderId === viewerId,
                }
                : null,
        };
    }
    async sendMessage(userId, conversationId, dto) {
        const conversation = await this._assertParticipant(userId, conversationId);
        if (dto.replyToId) {
            const parent = await this.prisma.message.findFirst({
                where: { id: dto.replyToId, conversationId },
                select: { id: true },
            });
            if (!parent) {
                throw new BadRequestException('El mensaje citado no pertenece a esta conversación.');
            }
        }
        const [message] = await this.prisma.$transaction([
            this.prisma.message.create({
                data: {
                    conversationId,
                    senderId: userId,
                    content: dto.content,
                    replyToId: dto.replyToId ?? null,
                },
                select: MESSAGE_SELECT,
            }),
            this.prisma.conversation.update({
                where: { id: conversationId },
                data: { lastMessageAt: new Date() },
            }),
        ]);
        const counterpartId = conversation.userAId === userId
            ? conversation.userBId
            : conversation.userAId;
        this.eventEmitter.emit(MESSAGE_CREATED, {
            targetUserId: counterpartId,
            conversationId,
            message: this.buildMessageView(message, counterpartId),
        });
        return this.buildMessageView(message, userId);
    }
    async listMessages(userId, conversationId, before, limit = 30) {
        await this._assertParticipant(userId, conversationId);
        const take = Math.min(Math.max(limit, 1), 100);
        const rows = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: take + 1,
            ...(before ? { cursor: { id: before }, skip: 1 } : {}),
            select: MESSAGE_SELECT,
        });
        const hasMore = rows.length > take;
        const page = hasMore ? rows.slice(0, take) : rows;
        const messages = page
            .reverse()
            .map((m) => this.buildMessageView(m, userId));
        return { messages, hasMore };
    }
    async markRead(userId, conversationId) {
        const conversation = await this._assertParticipant(userId, conversationId);
        const now = new Date();
        const result = await this.prisma.message.updateMany({
            where: { conversationId, senderId: { not: userId }, readAt: null },
            data: { readAt: now },
        });
        if (result.count > 0) {
            const counterpartId = conversation.userAId === userId
                ? conversation.userBId
                : conversation.userAId;
            this.eventEmitter.emit(MESSAGES_READ, {
                targetUserId: counterpartId,
                conversationId,
                readAt: now,
            });
            return { readAt: now };
        }
        return { readAt: null };
    }
    async listForUser(userId) {
        const participantWhere = {
            OR: [{ userAId: userId }, { userBId: userId }],
        };
        const conversations = await this.prisma.conversation.findMany({
            where: participantWhere,
            include: {
                userA: { select: PARTICIPANT_SELECT },
                userB: { select: PARTICIPANT_SELECT },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        content: true,
                        createdAt: true,
                        senderId: true,
                        readAt: true,
                    },
                },
            },
        });
        const unreadGroups = await this.prisma.message.groupBy({
            by: ['conversationId'],
            where: {
                conversation: participantWhere,
                senderId: { not: userId },
                readAt: null,
            },
            _count: { _all: true },
        });
        const unreadMap = new Map(unreadGroups.map((g) => [g.conversationId, g._count._all]));
        const items = conversations.map((c) => this.buildListItem(c, userId, c.messages[0] ?? null, unreadMap.get(c.id) ?? 0));
        items.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
        return items;
    }
    async broadcastProfileUpdate(userId) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                OR: [
                    { userAId: userId, anonymousA: false },
                    { userBId: userId, anonymousB: false },
                ],
            },
            include: DETAIL_INCLUDE,
        });
        for (const conversation of conversations) {
            const counterpartId = conversation.userAId === userId
                ? conversation.userBId
                : conversation.userAId;
            const payload = {
                targetUserId: counterpartId,
                conversationId: conversation.id,
                counterpart: this.buildCounterpartView(conversation, counterpartId),
            };
            this.eventEmitter.emit(CONVERSATION_COUNTERPART_UPDATED, payload);
        }
    }
    handleProfileUpdated(event) {
        this.broadcastProfileUpdate(event.userId).catch((err) => this.logger.error(`No se pudo propagar la actualización de perfil de ${event.userId}`, err instanceof Error ? err.stack : String(err)));
    }
    async broadcastPresence(userId, online) {
        const conversations = await this.prisma.conversation.findMany({
            where: { OR: [{ userAId: userId }, { userBId: userId }] },
            select: { id: true, userAId: true, userBId: true },
        });
        for (const c of conversations) {
            const counterpartId = c.userAId === userId ? c.userBId : c.userAId;
            this.eventEmitter.emit(CONVERSATION_PRESENCE, {
                targetUserId: counterpartId,
                conversationId: c.id,
                online,
            });
        }
    }
    handlePresenceChanged(event) {
        this.broadcastPresence(event.userId, event.online).catch((err) => this.logger.error(`No se pudo propagar la presencia de ${event.userId}`, err instanceof Error ? err.stack : String(err)));
    }
    async forwardTyping(event) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: event.conversationId,
                OR: [{ userAId: event.senderId }, { userBId: event.senderId }],
            },
            select: { userAId: true, userBId: true },
        });
        if (!conversation)
            return;
        const counterpartId = conversation.userAId === event.senderId
            ? conversation.userBId
            : conversation.userAId;
        this.eventEmitter.emit(CONVERSATION_TYPING, {
            targetUserId: counterpartId,
            conversationId: event.conversationId,
            typing: event.typing,
        });
    }
    handleTypingSignal(event) {
        this.forwardTyping(event).catch((err) => this.logger.error(`No se pudo propagar el typing de ${event.senderId}`, err instanceof Error ? err.stack : String(err)));
    }
};
__decorate([
    OnEvent(PROFILE_UPDATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsService.prototype, "handleProfileUpdated", null);
__decorate([
    OnEvent(PRESENCE_CHANGED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsService.prototype, "handlePresenceChanged", null);
__decorate([
    OnEvent(TYPING_SIGNAL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsService.prototype, "handleTypingSignal", null);
ConversationsService = ConversationsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventEmitter2,
        PresenceService])
], ConversationsService);
export { ConversationsService };
//# sourceMappingURL=conversations.service.js.map