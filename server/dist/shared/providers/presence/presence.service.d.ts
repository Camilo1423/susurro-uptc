export declare class PresenceService {
    private readonly users;
    connect(userId: string, socketId: string): void;
    disconnect(userId: string, socketId: string): void;
    setAway(userId: string, socketId: string, away: boolean): void;
    isOnline(userId: string): boolean;
}
