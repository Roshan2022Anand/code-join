import React, { useState, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { MyContext } from "../utility/MyContext";
import { Terminal as XTerminal } from "@xterm/xterm";
const ContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [socket, setsocket] = useState<Socket | null>(null);
  const [terminal, setTerminal] = useState<XTerminal | null>(null);

  return (
    <MyContext.Provider value={{ socket, setsocket, terminal, setTerminal }}>
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
