import { useCallback, useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useTerminalService = () => {
  //socket from context
  const { socket, terminal } = useMyContext();

  //global state from redux
  const { roomID } = useSelector((state: RootState) => state.room);
  const { editorLang } = useSelector((state: RootState) => state.file);

  //terminal socket events captured
  useEffect(() => {
    if (!socket || !terminal) return;
    if (socket.hasListeners("terminal-output")) return;

    //to listen terminal output
    socket.on("terminal-output", (data: string) => {
      terminal.write(data);
    });

    return () => {
      socket.off("terminal-output");
    };
  }, [socket, terminal]);

  //function to emmit terminal input
  const setTerminalInput = (key: string) => {
    socket?.emit("terminal-input", { key, roomID });
  };

  //function to run non interactive command
  const runCode = useCallback(
    (code: string) => {
      terminal?.clear();

      socket?.emit("run-code", {
        code,
        roomID,
        lang: editorLang,
      });
    },
    [socket, roomID, editorLang, terminal]
  );

  return { setTerminalInput, runCode };
};

export default useTerminalService;
