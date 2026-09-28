var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let PresenceService = class PresenceService {
    users = new Map();
    connect(userId, socketId) {
        let sockets = this.users.get(userId);
        if (!sockets) {
            sockets = new Map();
            this.users.set(userId, sockets);
        }
        sockets.set(socketId, false);
    }
    disconnect(userId, socketId) {
        const sockets = this.users.get(userId);
        if (!sockets)
            return;
        sockets.delete(socketId);
        if (sockets.size === 0)
            this.users.delete(userId);
    }
    setAway(userId, socketId, away) {
        const sockets = this.users.get(userId);
        if (!sockets || !sockets.has(socketId))
            return;
        sockets.set(socketId, away);
    }
    isOnline(userId) {
        const sockets = this.users.get(userId);
        if (!sockets)
            return false;
        for (const away of sockets.values()) {
            if (!away)
                return true;
        }
        return false;
    }
};
PresenceService = __decorate([
    Injectable()
], PresenceService);
export { PresenceService };
//# sourceMappingURL=presence.service.js.map