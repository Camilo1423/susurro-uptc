import { Logger, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  CONVERSATION_COUNTERPART_UPDATED,
  CONVERSATION_CREATED,
  CONVERSATION_DELETED,
  type ConversationCounterpartUpdatedEvent,
  type ConversationCreatedEvent,
  type ConversationDeletedEvent,
} from '../../events/conversation.events.js';
import {
  CONVERSATION_PRESENCE,
  PRESENCE_CHANGED,
  type ConversationPresenceEvent,
  type PresenceChangedEvent,
} from '../../events/presence.events.js';
import {
  CONVERSATION_TYPING,
  TYPING_SIGNAL,
  type ConversationTypingEvent,
  type TypingSignalEvent,
} from '../../events/typing.events.js';
import {
  MESSAGES_READ,
  MESSAGE_CREATED,
  type MessageCreatedEvent,
  type MessagesReadEvent,
} from '../../events/message.events.js';
import { TokensService } from '../../modules/tokens/index.js';
import { PresenceService } from '../presence/index.js';

/** Gracia antes de declarar offline (evita parpadeo en refresh/reconexión). */
const OFFLINE_GRACE_MS = 8_000;

/**
 * Gateway de Socket.IO. Se adjunta al mismo servidor HTTP en el path `/ws`. La
 * conexión se autentica con un token EFÍMERO de socket (`handshake.auth.token`),
 * emitido por `POST /api/v1/socket/auth/socket-token`. Al conectar, el cliente se
 * une a su sala personal `user:<id>` (y a la de su sesión).
 */
@WebSocketGateway({
  path: '/ws',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  // Recupera sesión + paquetes no entregados en micro-cortes de red (≤ 2 min).
  // Para desconexiones largas, el cliente reconcilia por REST al reconectar.
  connectionStateRecovery: { maxDisconnectionDuration: 120_000 },
})
export class SocketProvider
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(SocketProvider.name);

  /** Timers de "gracia" para no declarar offline en desconexiones breves. */
  private readonly offlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly tokensService: TokensService,
    private readonly presence: PresenceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Emite el cambio de presencia solo si el estado efectivo cambió. */
  private syncPresence(userId: string, wasOnline: boolean): void {
    const isOnline = this.presence.isOnline(userId);
    if (isOnline === wasOnline) return;

    if (isOnline) {
      // Volvió a estar online: cancela cualquier "offline" pendiente y avisa.
      const pending = this.offlineTimers.get(userId);
      if (pending) {
        clearTimeout(pending);
        this.offlineTimers.delete(userId);
      }
      this.eventEmitter.emit(PRESENCE_CHANGED, {
        userId,
        online: true,
      } satisfies PresenceChangedEvent);
      return;
    }

    // Pasó a offline: espera la gracia; si sigue offline, recién avisa.
    const timer = setTimeout(() => {
      this.offlineTimers.delete(userId);
      if (!this.presence.isOnline(userId)) {
        this.eventEmitter.emit(PRESENCE_CHANGED, {
          userId,
          online: false,
        } satisfies PresenceChangedEvent);
      }
    }, OFFLINE_GRACE_MS);
    this.offlineTimers.set(userId, timer);
  }

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('🚀 Socket.IO gateway inicializado en /ws');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        client.emit('error', { message: 'Token requerido' });
        client.disconnect();
        return;
      }

      const payload = await this.tokensService.verifySocketToken(token);
      if (!payload?.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      client.data = { userId: payload.sub, sessionId: payload.session_id };

      const userRoom = `user:${payload.sub}`;
      await client.join(userRoom);
      if (payload.session_id) {
        await client.join(`session:${payload.sub}:${payload.session_id}`);
      }

      // Presencia: registra este socket y avisa si el usuario pasó a online.
      const wasOnline = this.presence.isOnline(payload.sub);
      this.presence.connect(payload.sub, client.id);
      this.syncPresence(payload.sub, wasOnline);

      client.emit('authenticated', { userId: payload.sub, rooms: [userRoom] });
      this.logger.log(
        `✅ Socket autenticado: ${client.id} | user ${payload.sub}`,
      );
    } catch {
      this.logger.warn(`❌ Autenticación de socket fallida: ${client.id}`);
      client.emit('error', {
        message: 'Autenticación fallida',
        code: 'AUTH_FAILED',
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as { userId?: string } | undefined)?.userId;
    if (userId) {
      const wasOnline = this.presence.isOnline(userId);
      this.presence.disconnect(userId, client.id);
      this.syncPresence(userId, wasOnline);
    }
    this.logger.log(
      `🔴 Socket desconectado: ${client.id}${userId ? ` | user ${userId}` : ''}`,
    );
  }

  /** El cliente reporta que su pestaña quedó oculta mucho tiempo (away = gris). */
  @SubscribeMessage('presence:away')
  handlePresenceAway(client: Socket) {
    const userId = (client.data as { userId?: string } | undefined)?.userId;
    if (!userId) return;
    const wasOnline = this.presence.isOnline(userId);
    this.presence.setAway(userId, client.id, true);
    this.syncPresence(userId, wasOnline);
  }

  /** El cliente reporta que volvió a la pestaña (activo = verde). */
  @SubscribeMessage('presence:active')
  handlePresenceActive(client: Socket) {
    const userId = (client.data as { userId?: string } | undefined)?.userId;
    if (!userId) return;
    const wasOnline = this.presence.isOnline(userId);
    this.presence.setAway(userId, client.id, false);
    this.syncPresence(userId, wasOnline);
  }

  /** El cliente empezó a escribir en una conversación. */
  @SubscribeMessage('typing:start')
  handleTypingStart(client: Socket, payload: { conversationId?: string }) {
    this.emitTypingSignal(client, payload?.conversationId, true);
  }

  /** El cliente dejó de escribir (al salir del chat). */
  @SubscribeMessage('typing:stop')
  handleTypingStop(client: Socket, payload: { conversationId?: string }) {
    this.emitTypingSignal(client, payload?.conversationId, false);
  }

  /** Emite la señal cruda de typing (la conversación se valida en el servicio). */
  private emitTypingSignal(
    client: Socket,
    conversationId: string | undefined,
    typing: boolean,
  ): void {
    const userId = (client.data as { userId?: string } | undefined)?.userId;
    if (!userId || !conversationId) return;
    this.eventEmitter.emit(TYPING_SIGNAL, {
      senderId: userId,
      conversationId,
      typing,
    } satisfies TypingSignalEvent);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {
    void client.join(roomId);
    client.emit('room-joined', { roomId });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, roomId: string) {
    void client.leave(roomId);
    client.emit('room-left', { roomId });
  }

  /** Emite un evento a todas las conexiones de un usuario (uso futuro: mensajes). */
  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  /** Emite un evento a una sala arbitraria. */
  emitToRoom(room: string, event: string, payload: unknown): void {
    this.server.to(room).emit(event, payload);
  }

  /**
   * Cuando alguien cambia su anonimidad, empuja a la contraparte cómo la ve
   * ahora, para que su lista y su vista de info se sincronicen en tiempo real.
   */
  @OnEvent(CONVERSATION_COUNTERPART_UPDATED)
  handleCounterpartUpdated(payload: ConversationCounterpartUpdatedEvent): void {
    this.emitToUser(payload.targetUserId, 'conversation:updated', {
      conversationId: payload.conversationId,
      counterpart: payload.counterpart,
    });
  }

  /**
   * Cuando alguien inicia un chat con el PIN de otro, le empuja el item nuevo
   * para que la conversación aparezca en su lista en tiempo real.
   */
  @OnEvent(CONVERSATION_CREATED)
  handleConversationCreated(payload: ConversationCreatedEvent): void {
    this.emitToUser(payload.targetUserId, 'conversation:new', payload.item);
  }

  /**
   * Cuando un participante elimina el chat, avisa a la contraparte para que lo
   * quite de su lista (y lo cierre si lo tiene abierto).
   */
  @OnEvent(CONVERSATION_DELETED)
  handleConversationDeleted(payload: ConversationDeletedEvent): void {
    this.emitToUser(payload.targetUserId, 'conversation:deleted', {
      conversationId: payload.conversationId,
    });
  }

  /** Presencia de una contraparte en un chat → punto verde/gris del cliente. */
  @OnEvent(CONVERSATION_PRESENCE)
  handleConversationPresence(payload: ConversationPresenceEvent): void {
    this.emitToUser(payload.targetUserId, 'presence:changed', {
      conversationId: payload.conversationId,
      online: payload.online,
    });
  }

  /** "Escribiendo…" de una contraparte → animación en el cliente. */
  @OnEvent(CONVERSATION_TYPING)
  handleConversationTyping(payload: ConversationTypingEvent): void {
    this.emitToUser(payload.targetUserId, 'typing:changed', {
      conversationId: payload.conversationId,
      typing: payload.typing,
    });
  }

  /** Nuevo mensaje → se lo empuja a la contraparte. */
  @OnEvent(MESSAGE_CREATED)
  handleMessageCreated(payload: MessageCreatedEvent): void {
    this.emitToUser(payload.targetUserId, 'message:new', {
      conversationId: payload.conversationId,
      message: payload.message,
    });
  }

  /** La contraparte leyó mis mensajes → checks amarillos en tiempo real. */
  @OnEvent(MESSAGES_READ)
  handleMessagesRead(payload: MessagesReadEvent): void {
    this.emitToUser(payload.targetUserId, 'message:read', {
      conversationId: payload.conversationId,
      readAt: payload.readAt,
    });
  }
}
