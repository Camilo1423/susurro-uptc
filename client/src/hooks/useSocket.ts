import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/** Accede al socket. Debe usarse dentro de <SocketContextProvider>. */
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket debe usarse dentro de <SocketContextProvider>");
  }
  return ctx;
};
