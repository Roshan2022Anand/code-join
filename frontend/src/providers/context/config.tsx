import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { WsData, wsEvent } from "../../utility/Types";
import { Terminal as XTerminal } from "@xterm/xterm";

type contextT = {
  socket: WebSocket | null;
  setSocket: Dispatch<SetStateAction<WebSocket | null>>;
  WsEmit: (data: wsEvent) => void;
  WsOn: (ev: string, cb: (data: WsData) => void) => void;
  WsOff: (ev: string) => void;
  listeners: Map<string, (data: WsData) => void>;
  terminal: XTerminal | null;
  setTerminal: React.Dispatch<React.SetStateAction<XTerminal | null>>;
};

export const WsContext = createContext<contextT | null>(null);

export const useWsContext = () => {
  const context = useContext(WsContext);
  if (!context) {
    throw new Error("inter error");
  }
  return context;
};
