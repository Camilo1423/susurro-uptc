import { createContext } from "react";
import type { Socket } from "socket.io-client";

export type SocketEventHandler = (...args: unknown[]) => void;

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  /** Registra un listener; devuelve una función de cleanup. */
  on: (eventName: string, handler: SocketEventHandler) => () => void;
  off: (eventName: string, handler: SocketEventHandler) => void;
  emit: (eventName: string, ...args: unknown[]) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);
