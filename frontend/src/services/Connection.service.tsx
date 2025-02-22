import { useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { io } from "socket.io-client";

export const ConnectSocket = () => {
  const { setsocket } = useMyContext();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL as string);
    if (!newSocket) return
    setsocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [setsocket]);
};
