import React, { useState, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { MyContext } from "../utility/MyContext";
const ContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [socket, setsocket] = useState<Socket | null>(null);

  return (
    <MyContext.Provider value={{ socket, setsocket }}>
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
