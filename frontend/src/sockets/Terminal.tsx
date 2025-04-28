import { useCallback, useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setTerminalOutput } from "../redux/slices/File";

const useTerminalService = () => {
  //socket from context
  const { socket } = useMyContext();

  //global state from redux
  const dispatch = useDispatch();
  const { roomID } = useSelector((state: RootState) => state.room);
  const { editorLang, terminalOutput } = useSelector(
    (state: RootState) => state.file
  );

  //terminal socket events captured
  useEffect(() => {
    if (!socket) return;
    // if (socket.hasListeners("terminal-output")) return;

    //to listen terminal output
    socket.on("terminal-output", (data: string) => {
      const output = terminalOutput + data;
      console.log(terminalOutput, " + ", data);
      dispatch(setTerminalOutput(output));
    });

    return () => {
      socket.off("terminal-output");
    };
  }, [socket, dispatch, terminalOutput]);

  //function to run non interactive command
  const runCode = useCallback(
    (code: string) => {
      dispatch(setTerminalOutput(""));
      socket?.emit("run-code", {
        code,
        roomID,
        lang: editorLang,
      });
    },
    [socket, roomID, editorLang, dispatch]
  );

  return { runCode };
};

export default useTerminalService;
