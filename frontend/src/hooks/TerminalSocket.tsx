import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useWsContext } from "../providers/context/config";
import { RootState } from "../providers/redux/store";
import { WsData, wsEvent } from "../utility/Types";

const useTerminalService = () => {
  const { socket, terminal, listeners, WsOn, WsOff, WsEmit } = useWsContext();

  //global state from redux
  const { roomID } = useSelector((state: RootState) => state.room);

  //terminal socket events captured
  useEffect(() => {
    if (!socket || !terminal) return;
    if (listeners.has("terminal-output")) return;

    //to listen terminal output
    WsOn("terminal-output", ({ data }: WsData) => {
      terminal.write(data as string);
    });

    return () => {
      WsOff("terminal-output");
    };
  }, [WsOff, WsOn, listeners, socket, terminal]);

  //function to emmit terminal input
  const setTerminalInput = (key: string) => {
    const payload: wsEvent = {
      event: "terminal-input",
      data: { key, roomID },
    };
    WsEmit(payload);
  };

  //function to run non interactive command
  const runStream = (cmd: string, send: boolean) => {
    WsEmit({
      event: "stream-run",
      data: {
        cmd,
        roomID,
        send,
      },
    });
  };

  return { setTerminalInput, runStream };
};

export default useTerminalService;
