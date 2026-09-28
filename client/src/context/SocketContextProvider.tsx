import { Config } from "@Constant";
import { appContainer, USE_CASES_TYPES } from "@Container";
import { useAppSelector } from "@Redux";
import type { GetSocketCredentialsUseCase } from "@UseCase";
import { Logger } from "@Utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  SocketContext,
  type SocketContextType,
  type SocketEventHandler,
} from "./SocketContext";

/**
 * Provee la conexión de socket (Socket.IO) al árbol autenticado. Réplica del
 * patrón de medilaser-ui, sin toasts/sonidos/notificaciones: la conexión se
 * autentica con un token efímero (obtenido por caso de uso) y mantiene salas y
 * listeners a través de reconexiones.
 */
export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.session.user);
  const userId = user?.id;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const roomsRef = useRef<Set<string>>(new Set());
  const listenersRef = useRef<Map<string, Set<SocketEventHandler>>>(new Map());
  // Estado "away" (pestaña oculta mucho tiempo) — compartido con el reconectar.
  const awayRef = useRef(false);

  const getSocketCredentials = useMemo(
    () =>
      appContainer.get<GetSocketCredentialsUseCase>(
        USE_CASES_TYPES._GetSocketCredentials,
      ),
    [],
  );

  const joinRoom = useCallback((roomId: string) => {
    roomsRef.current.add(roomId);
    if (socketRef.current?.connected) socketRef.current.emit("join-room", roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    roomsRef.current.delete(roomId);
    if (socketRef.current?.connected)
      socketRef.current.emit("leave-room", roomId);
  }, []);

  const off = useCallback((eventName: string, handler: SocketEventHandler) => {
    listenersRef.current.get(eventName)?.delete(handler);
    socketRef.current?.off(eventName, handler);
  }, []);

  const on = useCallback(
    (eventName: string, handler: SocketEventHandler) => {
      if (!listenersRef.current.has(eventName)) {
        listenersRef.current.set(eventName, new Set());
      }
      listenersRef.current.get(eventName)?.add(handler);
      socketRef.current?.on(eventName, handler);
      return () => off(eventName, handler);
    },
    [off],
  );

  const emit = useCallback((eventName: string, ...args: unknown[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, ...args);
    } else {
      Logger.warn(`No se puede emitir "${eventName}": socket desconectado`);
    }
  }, []);

  useEffect(() => {
    if (!userId) return; // sin sesión no se conecta

    const newSocket = io(Config.Api, {
      path: "/ws",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      auth: async (cb) => {
        try {
          const creds = await getSocketCredentials.execute();
          cb({ token: creds.access_token });
        } catch (error) {
          Logger.error("Error al obtener token de socket:", error);
          cb({ token: null });
        }
      },
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setSocket(newSocket);
      setIsConnected(true);
      Logger.log("✅ Socket conectado:", newSocket.id);
      // Re-unirse a salas y re-adjuntar listeners tras (re)conexión.
      // `connect` se dispara en CADA reconexión sobre la MISMA instancia, así que
      // primero quitamos (off) y luego agregamos (on) para no duplicar handlers
      // (un handler duplicado sobrevive al desmontar y dispara efectos fantasma).
      roomsRef.current.forEach((roomId) => newSocket.emit("join-room", roomId));
      listenersRef.current.forEach((handlers, eventName) => {
        handlers.forEach((handler) => {
          newSocket.off(eventName, handler);
          newSocket.on(eventName, handler);
        });
      });
      // Si la pestaña sigue oculta al (re)conectar, re-avisa el estado away.
      if (awayRef.current) newSocket.emit("presence:away");
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      Logger.log(`❌ Socket desconectado: ${reason}`);
    });

    newSocket.on("authenticated", () => {
      Logger.log("🔐 Socket autenticado");
    });

    newSocket.on("error", (err) => {
      Logger.error("Error de socket:", err);
    });

    return () => {
      roomsRef.current.forEach((roomId) => newSocket.emit("leave-room", roomId));
      listenersRef.current.forEach((handlers, eventName) => {
        handlers.forEach((handler) => newSocket.off(eventName, handler));
      });
      newSocket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Presencia "away": si la pestaña queda oculta un buen rato, avisamos al
  // servidor para que nos marque en gris; al volver, verde de inmediato.
  useEffect(() => {
    if (!userId) return;
    const AWAY_DELAY = 2 * 60 * 1000; // 2 min oculto → away
    let awayTimer: ReturnType<typeof setTimeout> | null = null;

    const goAway = () => {
      awayTimer = null;
      awayRef.current = true;
      socketRef.current?.emit("presence:away");
    };
    const goActive = () => {
      if (awayTimer) {
        clearTimeout(awayTimer);
        awayTimer = null;
      }
      if (awayRef.current) {
        awayRef.current = false;
        socketRef.current?.emit("presence:active");
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (!awayTimer && !awayRef.current) awayTimer = setTimeout(goAway, AWAY_DELAY);
      } else {
        goActive();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (awayTimer) clearTimeout(awayTimer);
    };
  }, [userId]);

  const value = useMemo<SocketContextType>(
    () => ({ socket, isConnected, joinRoom, leaveRoom, on, off, emit }),
    [socket, isConnected, joinRoom, leaveRoom, on, off, emit],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
