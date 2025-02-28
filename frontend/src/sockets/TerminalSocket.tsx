import { useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setBuffer } from "../redux/slices/TerminalSlice";

const useTerminalService = () => {
  //socket from context
  const { socket, terminal } = useMyContext();

  //global state from redux
  const dispatch = useDispatch();
  const { roomID } = useSelector((state: RootState) => state.room);
  const { terminalLoc } = useSelector((state: RootState) => state.terminal);

  //terminal socket events captured
  useEffect(() => {
    if (!socket || !terminal) return;

    //to listen terminal write
    socket.on("terminal-write", ({ key, buffer }) => {
      if (key === "clear") terminal.clear();
      else {
        terminal.write(key);
        dispatch(setBuffer(buffer));
      }
    });

    //to listen terminal output
    socket.on("terminal-output", (data) => {
      terminal.write("\r\n" + data + "\r\n" + "\r\n" + terminalLoc + " :> ");
      dispatch(setBuffer(""));
    });
  }, [socket, terminal, dispatch, terminalLoc]);

  //function to emmit terminal input
  const setTerminalInput = (key: string, buffer: string) => {
    socket?.emit("terminal-input", {
      key,
      buffer,
      roomID,
    });
  };
  //to create new line with current location
  const newLine = () => {
    setTerminalInput("\r\n" + terminalLoc + " :> ", "");
  };

  //function to emmit terminal run
  const runTerminal = (buffer: string, wrkDir?: string) => {
    if (buffer.includes("clear")) {
      newLine();
      setTerminalInput("clear", "");
    } else if (buffer !== "")
      socket?.emit("terminal-run", {
        cmd: buffer,
        roomID,
        loc: wrkDir || terminalLoc,
      });
    else newLine();
  };

  return { setTerminalInput, runTerminal };
};

export default useTerminalService;
