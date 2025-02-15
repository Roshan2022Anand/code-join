import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
//@ts-ignore
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const dispatch = useDispatch();
  const { activeSection } = useSelector((state: RootState) => state.editor);
  const { currentLang ,containerOutput} = useSelector((state: RootState) => state.terminalS);

  // Initialize terminal
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
     const terminal = new XTerminal({
      cursorBlink: true,
      // rows: 20,
      // cols: 50,
    });

    terminal.open(terminalRef.current);
    terminal.onData((data) => {
      console.log(data);
      terminal.write(data);
    });

    if (containerOutput) {
      terminal.write(containerOutput);
    }

    return () => {
      terminal.dispose();
    };
  }, [containerOutput]);


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
      {currentLang ? (
        <div ref={terminalRef} className="flex-1 bg-secondary"></div>
      ) : (
        <h3 className="flex-1 content-center text-center">
          Plz slect an env..
        </h3>
      )}
    </article>
  );
};

export default Terminal;
