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

  //terminal socket events captured
  useEffect(() => {
    if (!socket || !terminal) return;
    if (socket.listeners("terminal-write").length == 1) return;

    //to listen terminal write
    socket.on(
      "terminal-write",
      ({ key, buffer }: { key: string; buffer: string }) => {
        terminal.write(key);
        dispatch(setBuffer(buffer));
      }
    );

    //to listen terminal output
    socket.on("terminal-output", (data: string) => {
      terminal.write(data);
      dispatch(setBuffer(""));
    });

    return () => {
      socket.off("terminal-write");
      socket.off("terminal-output");
    };
  }, [socket, terminal, dispatch]);

  //function to emmit terminal input
  const setTerminalInput = (key: string, buffer: string) => {
    socket?.emit("terminal-input", {
      key,
      buffer,
      roomID,
    });
  };

  //function to emmit terminal run
  const runTerminal = (buffer: string) => {
    socket?.emit("terminal-run", {
      cmd: buffer + "\n",
      roomID,
    });
  };

  return { setTerminalInput, runTerminal };
};

export default useTerminalService;
