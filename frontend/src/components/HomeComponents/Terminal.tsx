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
import { FaPlus } from "react-icons/fa";

const Terminal = () => {
  //Xterminal from context
  const { setTerminal, terminal } = useMyContext();

  //global state from redux
  const dispatch = useDispatch();
  const { activeSection, editorHeight, editorWidth } = useSelector(
    (state: RootState) => state.editor
  );

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

    return () => {
      terminalInstance.dispose();
    };
  }, [setTerminal]);

  //fit terminal to the container when resize
  useEffect(() => {
    fitAddon.current?.fit();
  }, [editorHeight, editorWidth]);

  const { setTerminalInput } = useTerminalService();
  useEffect(() => {
    if (!terminal) return;

    // Handle key press on terminal
    const handleKey = ({
      key,
    }: // domEvent,
    {
      key: string;
      domEvent: KeyboardEvent;
    }) => {
      setTerminalInput(key);
    };

    const keyListener = terminal.onKey(handleKey);
    terminal.scrollToBottom();
    return () => {
      keyListener.dispose();
    };
  }, [setTerminalInput, terminal]);

  return (
    <article
      className={`flex-1 flex flex-col overflow-hidden rounded-md bg-secondary border-4 border-soft ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >
      <header className="bg-soft py-2 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
        <button className="ml-auto">
          <FaPlus className="icon-md" />
        </button>
      </header>
      <section className="flex-1 flex">
        <div ref={terminalRef} className="flex-1 size-full"></div>
        {/* <div className="w-[100px] border-2 bg-black"></div> */}
      </section>
    </article>
  );
};

export default Terminal;
