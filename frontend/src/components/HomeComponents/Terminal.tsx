import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import { FitAddon } from "@xterm/addon-fit";
//@ts-ignore
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const dispatch = useDispatch();
  const { activeSection, editorHeight, editorWidth } = useSelector(
    (state: RootState) => state.editor
  );
  const {  currentLoc } = useSelector(
    (state: RootState) => state.terminalS
  );

  // Initialize terminal
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    fitAddon.current = new FitAddon();
    const terminal = new XTerminal({
      cursorBlink: true,
    });
    terminal.loadAddon(fitAddon.current);
    terminal.open(terminalRef.current);
    fitAddon.current.fit();

    let commandBuffer = "";
    const newLine = () => {
      commandBuffer = currentLoc + " > " || "";
    };

    if (currentLoc) {
      newLine();
      terminal.write(commandBuffer);
    }

    // Handle key press on terminal
    terminal.onKey(({ key, domEvent }) => {
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      const keyCode = domEvent.keyCode;

      if (keyCode === 13) {
        //when pressed enter
        newLine();
        terminal.write("\r\n" + commandBuffer);
      } else if (keyCode == 8) {
        //when pressed backspace
        if (commandBuffer == currentLoc + " > ") return;
        commandBuffer = commandBuffer.slice(0, -1);
        terminal.write("\b \b");
      } else if (printable) {
        //when pressed any other key
        commandBuffer += key;
        terminal.write(key);
      }
    });

    return () => {
      terminal.dispose();
    };
  }, [currentLoc]);

  //fit terminal to the container when resize
  useEffect(() => {
    if (!fitAddon.current) return;
    fitAddon.current.fit();
  }, [editorHeight, editorWidth]);

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
      {currentLoc ? (
        <div ref={terminalRef} className="flex-1"></div>
      ) : (
        <h3 className="flex-1 content-center text-center">
          Plz slect an env..
        </h3>
      )}
    </article>
  );
};

export default Terminal;
