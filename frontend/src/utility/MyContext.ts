import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

// Define the type for our context value
interface MyContextType {
  socket: Socket | null;
  setsocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

// Create the context with an initial undefined value
export const MyContext = createContext<MyContextType | undefined>(undefined);

// Custom hook to use the MyContext
export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
