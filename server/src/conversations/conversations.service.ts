import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AvatarType, UserStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../shared/modules/prisma/index.js';
import {
  CONVERSATION_COUNTERPART_UPDATED,
  CONVERSATION_CREATED,
  CONVERSATION_DELETED,
  type ConversationCounterpartUpdatedEvent,
  type ConversationCreatedEvent,
  type ConversationDeletedEvent,
  type CounterpartView,
} from '../shared/events/conversation.events.js';
import {
  PROFILE_UPDATED,
  type ProfileUpdatedEvent,
} from '../shared/events/profile.events.js';
import {
  CONVERSATION_PRESENCE,
  PRESENCE_CHANGED,
  type ConversationPresenceEvent,
  type PresenceChangedEvent,
} from '../shared/events/presence.events.js';
import {
  CONVERSATION_TYPING,
  TYPING_SIGNAL,
  type ConversationTypingEvent,
  type TypingSignalEvent,
} from '../shared/events/typing.events.js';
import {
  MESSAGES_READ,
  MESSAGE_CREATED,
  type MessageCreatedEvent,
  type MessageItemView,
  type MessagesReadEvent,
} from '../shared/events/message.events.js';
import { PresenceService } from '../shared/providers/presence/index.js';
import { generateAliasPair } from '../shared/utils/alias.util.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

/** Datos del participante que necesita el detalle (incluye tipos de avatar). */
const PARTICIPANT_SELECT = {
  id: true,
  firstName: true,
  secondName: true,
  firstLastName: true,
  secondLastName: true,
  avatars: { select: { type: true, updatedAt: true } },
} as const;

/** Include de ambos participantes para el detalle del chat. */
const DETAIL_INCLUDE = {
  userA: { select: PARTICIPANT_SELECT },
  userB: { select: PARTICIPANT_SELECT },
} as const;

/** Campos de un mensaje + el mensaje citado (para las respuestas). */
const MESSAGE_SELECT = {
  id: true,
  content: true,
  senderId: true,
  readAt: true,
  createdAt: true,
  replyTo: { select: { id: true, content: true, senderId: true } },
} as const;

/** Una página del historial de mensajes. */
export interface MessagesPage {
  messages: MessageItemView[];
  /** `true` si hay mensajes más antiguos por cargar. */
  hasMore: boolean;
}

/**
 * Item de la lista de chats. Solo describe al OTRO participante (a mí ya me
 * conozco): si está anónimo se muestra su alias del sistema; si NO está anónimo
 * se devuelve su nombre completo y su avatar. Nunca datos del usuario que llama.
 */
export interface ChatListItem {
  conversationId: string;
  /** `true` si el otro participante se muestra anónimo para mí. */
  isAnonymous: boolean;
  /** Alias del sistema si el otro está anónimo, o su nombre completo si no. */
  displayName: string;
  /** Ruta del thumbnail del otro (solo si NO está anónimo; si no, null). */
  avatar: string | null;
  /** Último mensaje (contenido) de la conversación, o null si aún no hay. */
  lastMessage: {
    content: string;
    createdAt: Date;
    fromMe: boolean;
    /** Confirmación de lectura del último mensaje (para el check en la card). */
    readAt: Date | null;
  } | null;
  /** Mensajes sin leer que me enviaron. */
  unreadCount: number;
  /** Momento de la última actividad (para ordenar y mostrar). */
  lastActivityAt: Date;
  /** `true` si la contraparte está conectada y activa ahora (punto verde). */
  online: boolean;
}

/** Resultado de iniciar una conversación. */
export interface CreatedConversation {
  conversationId: string;
  /** `true` si se creó ahora; `false` si ya existía entre ambos. */
  created: boolean;
}

/** Resultado de un chat aleatorio (incluye aviso de posible desconexión). */
export interface RandomConversation extends CreatedConversation {
  /** `true` si el elegido NO está en línea (avisar que quizá no responda ya). */
  warnOffline: boolean;
}

/** Detalle de un chat para visualizar su información. */
export interface ChatDetail {
  conversationId: string;
  /** El otro participante (respeta su anonimidad). */
  counterpart: {
    isAnonymous: boolean;
    displayName: string;
    avatar: string | null;
  };
  /** Mi estado en este chat. */
  me: {
    isAnonymous: boolean;
    /** Alias con el que me ve el otro cuando estoy anónimo. */
    alias: string;
  };
  createdAt: Date;
  lastActivityAt: Date | null;
}

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly presence: PresenceService,
  ) {}

  /**
   * Ruta del avatar con "cache-buster" (`&v=<updatedAt>`): como la clave del
   * objeto es estable, sin esto el navegador de la contraparte mostraría la foto
   * vieja tras un cambio. La versión solo cambia cuando el avatar cambia.
   */
  private avatarPath(
    userId: string,
    type: 'thumbnail' | 'original',
    updatedAt: Date,
  ): string {
    return `/api/v1/avatars/${userId}?type=${type}&v=${updatedAt.getTime()}`;
  }

  /**
   * Inicia una conversación con el dueño del PIN. Si el PIN no existe, lanza un
   * error genérico (no revela que el PIN no existe). Si ya hay conversación entre
   * ambos, la reutiliza. El par se canonicaliza (userA = id menor) para no duplicar.
   */
  async createByPin(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<CreatedConversation> {
    const target = await this.prisma.user.findUnique({
      where: { pin: dto.pin },
      select: { id: true },
    });

    // PIN inexistente → mensaje genérico (no revelador).
    if (!target) {
      throw new InternalServerErrorException(
        'Algo pasó, estamos trabajando para arreglar el error.',
      );
    }

    if (target.id === userId) {
      throw new BadRequestException('No puedes iniciar un chat contigo mismo.');
    }

    return this._startConversation(userId, target.id);
  }

  /**
   * Crea (o reutiliza) la conversación entre dos usuarios. Canonicaliza el par
   * (userA = id menor) para no duplicar y, si es nueva, avisa a la contraparte.
   */
  private async _startConversation(
    userId: string,
    targetId: string,
  ): Promise<CreatedConversation> {
    const [userAId, userBId] =
      userId < targetId ? [userId, targetId] : [targetId, userId];

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

    // Refleja el chat nuevo en tiempo real en la lista de la contraparte.
    const payload: ConversationCreatedEvent = {
      targetUserId: targetId,
      item: this.buildListItem(conversation, targetId, null, 0),
    };
    this.eventEmitter.emit(CONVERSATION_CREATED, payload);

    return { conversationId: conversation.id, created: true };
  }

  /**
   * Inicia un chat con un usuario ALEATORIO con el que aún no tengo conversación.
   * Prioriza usuarios EN LÍNEA (actividad reciente); si no hay ninguno en línea,
   * igual crea el chat pero marca `warnOffline` para avisar que probablemente no
   * esté conectado.
   */
  async startRandom(userId: string): Promise<RandomConversation> {
    // Ids de usuarios con los que YA tengo conversación (para excluirlos).
    const myConversations = await this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { userAId: true, userBId: true },
    });
    const excluded = new Set<string>([userId]);
    for (const c of myConversations) {
      excluded.add(c.userAId);
      excluded.add(c.userBId);
    }

    // Candidatos: usuarios activos con los que no tengo chat.
    const candidates = await this.prisma.user.findMany({
      where: { id: { notIn: [...excluded] }, status: UserStatus.ACTIVE },
      select: { id: true },
    });

    if (candidates.length === 0) {
      throw new NotFoundException(
        'No encontramos usuarios disponibles para un chat aleatorio por ahora.',
      );
    }

    // Actividad reciente = en línea ahora. Se prioriza ese grupo.
    const online = candidates.filter((c) => this.presence.isOnline(c.id));
    const pool = online.length > 0 ? online : candidates;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const warnOffline = online.length === 0;

    const result = await this._startConversation(userId, chosen.id);
    return { ...result, warnOffline };
  }

  /** Busca la conversación asegurando que el usuario sea participante. */
  private async _findForParticipant(userId: string, conversationId: string) {
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

  /**
   * Cómo ve `viewerId` a la contraparte (alias vs nombre real, avatar thumb+orig
   * o null si anónimo / sin foto). Reutilizado por el detalle y por el evento de
   * socket.
   */
  private buildCounterpartView(
    conversation: Awaited<ReturnType<typeof this._findForParticipant>>,
    viewerId: string,
  ): CounterpartView {
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

    const thumb = counterpart.avatars.find(
      (a) => a.type === AvatarType.THUMBNAIL,
    );
    const original = counterpart.avatars.find(
      (a) => a.type === AvatarType.ORIGINAL,
    );

    return {
      isAnonymous: counterpartAnonymous,
      displayName: counterpartAnonymous ? counterpartAlias : fullName,
      avatarThumbnail:
        counterpartAnonymous || !thumb
          ? null
          : this.avatarPath(counterpart.id, 'thumbnail', thumb.updatedAt),
      avatarOriginal:
        counterpartAnonymous || !original
          ? null
          : this.avatarPath(counterpart.id, 'original', original.updatedAt),
    };
  }

  /**
   * Arma un item de la lista de chats desde la perspectiva de `viewerId`
   * (alias vs nombre real, avatar thumb o null, último mensaje y no leídos).
   * Reutilizado por `listForUser` y por la notificación de chat nuevo.
   */
  private buildListItem(
    conversation: Awaited<ReturnType<typeof this._findForParticipant>>,
    viewerId: string,
    last: {
      content: string;
      createdAt: Date;
      senderId: string;
      readAt: Date | null;
    } | null,
    unreadCount: number,
  ): ChatListItem {
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

    const thumb = counterpart.avatars.find(
      (a) => a.type === AvatarType.THUMBNAIL,
    );

    return {
      conversationId: conversation.id,
      isAnonymous: counterpartAnonymous,
      displayName: counterpartAnonymous ? counterpartAlias : fullName,
      avatar:
        counterpartAnonymous || !thumb
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

  /** Arma el detalle del chat desde la perspectiva de `userId`. */
  private buildDetail(
    conversation: Awaited<ReturnType<typeof this._findForParticipant>>,
    userId: string,
  ): ChatDetail {
    const iAmUserA = conversation.userAId === userId;
    const myAlias = iAmUserA ? conversation.aliasA : conversation.aliasB;
    const myAnonymous = iAmUserA
      ? conversation.anonymousA
      : conversation.anonymousB;

    // El detalle muestra la ORIGINAL (mejor resolución).
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

  /** Detalle del chat para visualizar su información. */
  async getDetail(userId: string, conversationId: string): Promise<ChatDetail> {
    const conversation = await this._findForParticipant(userId, conversationId);
    return this.buildDetail(conversation, userId);
  }

  /**
   * Activa/desactiva MI anonimidad en el chat (solo mi propio flag). Devuelve el
   * detalle actualizado.
   */
  async setMyAnonymity(
    userId: string,
    conversationId: string,
    anonymous: boolean,
  ): Promise<ChatDetail> {
    const conversation = await this._findForParticipant(userId, conversationId);
    const iAmUserA = conversation.userAId === userId;

    const updated = await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: iAmUserA ? { anonymousA: anonymous } : { anonymousB: anonymous },
      include: DETAIL_INCLUDE,
    });

    // Sincroniza a la contraparte (B): le mandamos CÓMO me ve ahora a mí (A).
    const counterpartId = iAmUserA ? updated.userBId : updated.userAId;
    const payload: ConversationCounterpartUpdatedEvent = {
      targetUserId: counterpartId,
      conversationId: updated.id,
      counterpart: this.buildCounterpartView(updated, counterpartId),
    };
    this.eventEmitter.emit(CONVERSATION_COUNTERPART_UPDATED, payload);

    return this.buildDetail(updated, userId);
  }

  /**
   * Elimina un chat por completo (sus mensajes + la conversación). Solo puede
   * hacerlo alguno de los dos participantes (`_findForParticipant` lo garantiza).
   * Notifica a la contraparte para que lo quite (y lo cierre si lo tiene abierto).
   */
  async deleteConversation(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    const conversation = await this._findForParticipant(userId, conversationId);
    const counterpartId =
      conversation.userAId === userId
        ? conversation.userBId
        : conversation.userAId;

    // Borra mensajes + conversación de forma atómica (explícito, sin depender
    // del cascade del FK).
    await this.prisma.$transaction([
      this.prisma.message.deleteMany({ where: { conversationId } }),
      this.prisma.conversation.delete({ where: { id: conversationId } }),
    ]);

    const payload: ConversationDeletedEvent = {
      targetUserId: counterpartId,
      conversationId,
    };
    this.eventEmitter.emit(CONVERSATION_DELETED, payload);
  }

  // ─── Mensajes ──────────────────────────────────────────────────────────────

  /** Verifica que el usuario sea participante y devuelve los ids del par. */
  private async _assertParticipant(userId: string, conversationId: string) {
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

  /** Vista de un mensaje desde la perspectiva de `viewerId`. */
  private buildMessageView(
    message: {
      id: string;
      content: string;
      senderId: string;
      readAt: Date | null;
      createdAt: Date;
      replyTo: { id: string; content: string; senderId: string } | null;
    },
    viewerId: string,
  ): MessageItemView {
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

  /**
   * Envía un mensaje. Valida participación y (si responde) que el mensaje citado
   * pertenezca a la MISMA conversación. Actualiza `lastMessageAt` y empuja el
   * mensaje a la contraparte por socket. Devuelve la vista para el remitente.
   */
  async sendMessage(
    userId: string,
    conversationId: string,
    dto: CreateMessageDto,
  ): Promise<MessageItemView> {
    const conversation = await this._assertParticipant(userId, conversationId);

    if (dto.replyToId) {
      const parent = await this.prisma.message.findFirst({
        where: { id: dto.replyToId, conversationId },
        select: { id: true },
      });
      if (!parent) {
        throw new BadRequestException(
          'El mensaje citado no pertenece a esta conversación.',
        );
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

    const counterpartId =
      conversation.userAId === userId
        ? conversation.userBId
        : conversation.userAId;

    // Se le manda la vista construida DESDE su perspectiva (fromMe=false).
    this.eventEmitter.emit(MESSAGE_CREATED, {
      targetUserId: counterpartId,
      conversationId,
      message: this.buildMessageView(message, counterpartId),
    } satisfies MessageCreatedEvent);

    return this.buildMessageView(message, userId);
  }

  /** Historial paginado por cursor (trae los anteriores a `before`). */
  async listMessages(
    userId: string,
    conversationId: string,
    before?: string,
    limit = 30,
  ): Promise<MessagesPage> {
    await this._assertParticipant(userId, conversationId);
    const take = Math.min(Math.max(limit, 1), 100);

    const rows = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: take + 1, // uno extra para saber si hay más
      ...(before ? { cursor: { id: before }, skip: 1 } : {}),
      select: MESSAGE_SELECT,
    });

    const hasMore = rows.length > take;
    const page = hasMore ? rows.slice(0, take) : rows;
    // Se devuelven en orden cronológico ascendente (para pintar de arriba abajo).
    const messages = page
      .reverse()
      .map((m) => this.buildMessageView(m, userId));

    return { messages, hasMore };
  }

  /**
   * Marca como leídos los mensajes que me envió la contraparte (los no leídos).
   * Si marcó alguno, avisa al remitente para que sus checks se pongan amarillos.
   */
  async markRead(
    userId: string,
    conversationId: string,
  ): Promise<{ readAt: Date | null }> {
    const conversation = await this._assertParticipant(userId, conversationId);
    const now = new Date();

    const result = await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: now },
    });

    if (result.count > 0) {
      const counterpartId =
        conversation.userAId === userId
          ? conversation.userBId
          : conversation.userAId;
      this.eventEmitter.emit(MESSAGES_READ, {
        targetUserId: counterpartId,
        conversationId,
        readAt: now,
      } satisfies MessagesReadEvent);
      return { readAt: now };
    }

    return { readAt: null };
  }

  /**
   * Devuelve TODOS los chats del usuario, ordenados por la actividad más reciente
   * (el mensaje más nuevo de cada conversación en la tabla de contenido).
   */
  async listForUser(userId: string): Promise<ChatListItem[]> {
    const participantWhere = {
      OR: [{ userAId: userId }, { userBId: userId }],
    };

    const conversations = await this.prisma.conversation.findMany({
      where: participantWhere,
      include: {
        userA: { select: PARTICIPANT_SELECT },
        userB: { select: PARTICIPANT_SELECT },
        // Último mensaje de cada conversación (la "actividad más reciente").
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

    // Conteo de no leídos (mensajes que me enviaron y no he leído) por conversación.
    const unreadGroups = await this.prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversation: participantWhere,
        senderId: { not: userId },
        readAt: null,
      },
      _count: { _all: true },
    });
    const unreadMap = new Map(
      unreadGroups.map((g) => [g.conversationId, g._count._all]),
    );

    const items = conversations.map<ChatListItem>((c) =>
      this.buildListItem(c, userId, c.messages[0] ?? null, unreadMap.get(c.id) ?? 0),
    );

    // Orden: actividad más reciente primero.
    items.sort(
      (a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime(),
    );

    return items;
  }

  /**
   * Un usuario cambió su nombre o su foto: notifica en tiempo real a cada
   * contraparte que lo ve con su identidad real. Solo abarca los chats donde el
   * usuario NO está anónimo (si lo está, la contraparte ve su alias y el cambio
   * de nombre/foto no le afecta). Reutiliza el evento `conversation:updated`.
   */
  async broadcastProfileUpdate(userId: string): Promise<void> {
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
      const counterpartId =
        conversation.userAId === userId
          ? conversation.userBId
          : conversation.userAId;
      const payload: ConversationCounterpartUpdatedEvent = {
        targetUserId: counterpartId,
        conversationId: conversation.id,
        counterpart: this.buildCounterpartView(conversation, counterpartId),
      };
      this.eventEmitter.emit(CONVERSATION_COUNTERPART_UPDATED, payload);
    }
  }

  /** Reacciona (desacoplado) a un cambio de perfil hecho en otro módulo. */
  @OnEvent(PROFILE_UPDATED)
  handleProfileUpdated(event: ProfileUpdatedEvent): void {
    this.broadcastProfileUpdate(event.userId).catch((err) =>
      this.logger.error(
        `No se pudo propagar la actualización de perfil de ${event.userId}`,
        err instanceof Error ? err.stack : String(err),
      ),
    );
  }

  /**
   * Cambió la presencia (online/offline) de un usuario: avisa a cada contraparte
   * POR conversación (no por userId, para no filtrar identidad ni correlacionar).
   */
  async broadcastPresence(userId: string, online: boolean): Promise<void> {
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
      } satisfies ConversationPresenceEvent);
    }
  }

  /** Reacciona (desacoplado) al cambio de presencia detectado por el gateway. */
  @OnEvent(PRESENCE_CHANGED)
  handlePresenceChanged(event: PresenceChangedEvent): void {
    this.broadcastPresence(event.userId, event.online).catch((err) =>
      this.logger.error(
        `No se pudo propagar la presencia de ${event.userId}`,
        err instanceof Error ? err.stack : String(err),
      ),
    );
  }

  /**
   * Reenvía el "escribiendo…" a la contraparte, validando primero que el emisor
   * sea participante de esa conversación (evita spam a chats ajenos).
   */
  private async forwardTyping(event: TypingSignalEvent): Promise<void> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: event.conversationId,
        OR: [{ userAId: event.senderId }, { userBId: event.senderId }],
      },
      select: { userAId: true, userBId: true },
    });
    if (!conversation) return; // no existe o el emisor no participa → se ignora

    const counterpartId =
      conversation.userAId === event.senderId
        ? conversation.userBId
        : conversation.userAId;

    this.eventEmitter.emit(CONVERSATION_TYPING, {
      targetUserId: counterpartId,
      conversationId: event.conversationId,
      typing: event.typing,
    } satisfies ConversationTypingEvent);
  }

  /** Reacciona (desacoplado) a la señal de typing detectada por el gateway. */
  @OnEvent(TYPING_SIGNAL)
  handleTypingSignal(event: TypingSignalEvent): void {
    this.forwardTyping(event).catch((err) =>
      this.logger.error(
        `No se pudo propagar el typing de ${event.senderId}`,
        err instanceof Error ? err.stack : String(err),
      ),
    );
  }
}
