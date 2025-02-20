import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import { FitAddon } from "@xterm/addon-fit";
//@ts-ignore
import "@xterm/xterm/css/xterm.css";
import { useRunContainerMutation } from "../../redux/slices/TerminalSlice";

const Terminal = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { activeSection, editorHeight, editorWidth } = useSelector(
    (state: RootState) => state.editor
  );
  const { currentLoc, containerID } = useSelector(
    (state: RootState) => state.terminalS
  );

  // Initialize terminal
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    fitAddon.current = new FitAddon();
    terminalInstance.current = new XTerminal({
      cursorBlink: true,
    });
    const terminal = terminalInstance.current;
    terminal.loadAddon(fitAddon.current);
    terminal.open(terminalRef.current);
    fitAddon.current.fit();

    return () => {
      terminal.dispose();
    };
  }, []);

  //fit terminal to the container when resize
  useEffect(() => {
    if (!fitAddon.current) return;
    fitAddon.current.fit();
  }, [editorHeight, editorWidth]);

  const [run, { data, isSuccess }] = useRunContainerMutation();

  useEffect(() => {
    const terminal = terminalInstance.current;
    if (!terminal || !currentLoc) return;
    let commandBuffer = "";

    //to create new line with current location
    const newLine = () => {
      commandBuffer = "";
      terminal.write("\r\n" + currentLoc + " :> ");
    };

    //show termjnal output
    if (isSuccess && data) {
      terminal.write("\r\n" + data.output);
      // newLine();
    }
    //  else
     newLine();

    // Handle key press on terminal
    terminal.onKey(({ key, domEvent }) => {
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      const keyCode = domEvent.keyCode;

      //pressed enter key
      if (keyCode === 13) {
        if (containerID && commandBuffer !== "") {
          const cmd = commandBuffer.split(" ");
          run({ containerID, cmd });
        } else newLine();
      } else if (keyCode == 8) {
        //pressed backspace key
        if (commandBuffer == "") return;
        commandBuffer = commandBuffer.slice(0, -1);
        terminal.write("\b \b");
      } else if (printable) {
        //pressed any other key
        commandBuffer += key;
        terminal.write(key);
      }
    });
  }, [containerID, run, currentLoc, isSuccess, data]);

  return (
    <article
      className={`flex-1 flex flex-col overflow-hidden rounded-md bg-secondary border-4 border-soft overflow-x-auto ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >
      <header className="bg-soft py-1 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
      </header>
      <div ref={terminalRef} className="flex-1"></div>
    </article>
  );
};

export default Terminal;
