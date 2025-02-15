import React, { useState, ReactNode } from "react";
import { MyContext } from "../utility/MyContext";
import { Socket } from "socket.io-client";

const ContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [socket, setsocket] = useState<Socket | null>(null);
  const [backendUrl, setbackendUrl] = useState("");
  return (
    <MyContext.Provider
      value={{ socket, setsocket, backendUrl, setbackendUrl }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
