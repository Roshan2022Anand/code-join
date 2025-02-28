import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import { FitAddon } from "@xterm/addon-fit";
//@ts-ignore
import "@xterm/xterm/css/xterm.css";
import useTerminalService from "../../sockets/TerminalSocket";
import { useMyContext } from "../../utility/MyContext";

const Terminal = () => {
  //Xterminal from context
  const { setTerminal, terminal } = useMyContext();

  //global state from redux
  const dispatch = useDispatch();
  const { activeSection, editorHeight, editorWidth } = useSelector(
    (state: RootState) => state.editor
  );
  const { buffer } = useSelector((state: RootState) => state.terminal);

  // Initialize terminal
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    fitAddon.current = new FitAddon();
    const terminalInstance = new XTerminal({
      cursorBlink: true,
    });
    setTerminal(terminalInstance);
    terminalInstance.loadAddon(fitAddon.current);
    terminalInstance.open(terminalRef.current);
    fitAddon.current.fit();

    terminalInstance.write("/root :> ");

    return () => {
      terminalInstance.dispose();
    };
  }, [setTerminal]);

  //fit terminal to the container when resize
  useEffect(() => {
    fitAddon.current?.fit();
  }, [editorHeight, editorWidth]);

  const { setTerminalInput, runTerminal } = useTerminalService();
  const keyListenerAdded = useRef(false);
  useEffect(() => {
    if (!terminal) return;

    // Handle key press on terminal
    const handleKey = ({
      key,
      domEvent,
    }: {
      key: string;
      domEvent: KeyboardEvent;
    }) => {
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      const keyCode = domEvent.keyCode;

      //pressed enter key
      if (keyCode === 13) {
        runTerminal(buffer);
      } else if (keyCode == 8) {
        //pressed backspace key
        if (buffer == "") return;
        setTerminalInput("\b \b", buffer.slice(0, -1));
      } else if (printable) {
        setTerminalInput(key, buffer + key);
      }
    };

    const keyListener = terminal.onKey(handleKey);
    terminal.scrollToBottom();
    keyListenerAdded.current = true;
    return () => {
      keyListener.dispose();
      keyListenerAdded.current = false;
    };
  }, [buffer, runTerminal, setTerminalInput, terminal]);

  return (
    <article
      className={`flex-1 flex flex-col overflow-hidden rounded-md bg-secondary border-4 border-soft ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >
      <header className="bg-soft py-1 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
      </header>
      <div ref={terminalRef} className="flex-1 size-full"></div>
    </article>
  );
};

export default Terminal;
