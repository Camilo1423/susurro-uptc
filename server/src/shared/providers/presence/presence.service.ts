import { Injectable } from '@nestjs/common';

/**
 * Presencia en memoria. Rastrea, por usuario, sus sockets conectados y si cada
 * uno está "away" (pestaña oculta mucho tiempo). Un usuario está ONLINE si tiene
 * al menos un socket activo (no away).
 *
 * Nota: es estado en memoria (single-instance). Con varias instancias habría que
 * respaldarlo con Redis/pub-sub; para un solo proceso es suficiente y, al
 * reiniciar, los clientes reconectan y se re-marcan.
 */
@Injectable()
export class PresenceService {
  /** userId -> (socketId -> away?) */
  private readonly users = new Map<string, Map<string, boolean>>();

  /** Registra un socket del usuario (activo por defecto). */
  connect(userId: string, socketId: string): void {
    let sockets = this.users.get(userId);
    if (!sockets) {
      sockets = new Map();
      this.users.set(userId, sockets);
    }
    sockets.set(socketId, false);
  }

  /** Quita un socket del usuario. */
  disconnect(userId: string, socketId: string): void {
    const sockets = this.users.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) this.users.delete(userId);
  }

  /** Marca un socket como away (true) o activo (false). */
  setAway(userId: string, socketId: string, away: boolean): void {
    const sockets = this.users.get(userId);
    if (!sockets || !sockets.has(socketId)) return;
    sockets.set(socketId, away);
  }

  /** Online = tiene al menos un socket activo (no away). */
  isOnline(userId: string): boolean {
    const sockets = this.users.get(userId);
    if (!sockets) return false;
    for (const away of sockets.values()) {
      if (!away) return true;
    }
    return false;
  }
}
