import { Editor, OnMount, useMonaco } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { FaCode, FaLaptopCode, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useTerminalService from "../../sockets/TerminalSocket";

const CodeEditor = () => {
  const navigate = useNavigate();
  //global state from redux
  const dispatch = useDispatch();
  const { editorHeight, activeSection } = useSelector(
    (state: RootState) => state.editor
  );
  const { editorLang, editorCode, openedFile, runCmd } = useSelector(
    (state: RootState) => state.terminal
  );
  const { roomID } = useSelector((state: RootState) => state.room);

  //redirect to dashboard if no containerID
  useEffect(() => {
    if (!roomID) navigate("/dashboard");
  }, [roomID, navigate]);

  // Set custom theme for monaco editor
  const monaco = useMonaco();
  useEffect(() => {
    if (monaco && typeof window !== "undefined") {
      monaco.editor.defineTheme("accentTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#191623",
          "editor.foreground": "#ffffff",
        },
      });

      monaco.editor.setTheme("accentTheme");
    }
  }, [monaco]);

  //getting the monaco editor values
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const { runTerminal } = useTerminalService();
  //to run the program
  const handleRunPrg = () => {
    const code = editorRef.current?.getValue();
    if (code) {
      //setting up the run command
      let run = "";
      if (runCmd == "") toast.error("Language not supported");
      else run = `&& ${runCmd} ${openedFile}`;

      //escaping special characters
      const filteredCode = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

      const cmd = `echo "${filteredCode}" > ${openedFile} ` + run;
      runTerminal(cmd, "/root");
    }
  };

  //to save the code on unmount
  useEffect(() => {
    return () => {
      if (activeSection == "code" && editorRef.current) {
        const code = editorRef.current.getValue();
        const filteredCode = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        runTerminal(`echo "${filteredCode}" > ${openedFile}`, "/root");
      }
    };
  }, [activeSection, openedFile, runTerminal]);

  return (
    <>
      <article
        className={`overflow-hidden rounded-md bg-secondary h-[90%] flex flex-col ${
          activeSection == "code" && "border-4 border-accent-300"
        }`}
        onClick={() => dispatch(setActiveSection("code"))}
        style={{
          height: `clamp(5%,${editorHeight}px,75%)`,
        }}
      >
        <header className="py-2 px-3 bg-soft flex gap-3 items-center justify-between">
          <FaCode className="icon-md" />
          <h3 className="mr-auto">CODE</h3>
          <button className="mr-2" onClick={handleRunPrg}>
            <FaPlay className="icon-md" />
          </button>
        </header>
        {editorCode !== null ? (
          <>
            <p>{openedFile?.replace(/\//g, " > ")}</p>
            <Editor
              height="1000px"
              language={editorLang || "plaintext"}
              theme="accentTheme"
              value={editorCode}
              onMount={handleEditorMount}
              options={{
                fontSize: 20,
                minimap: { enabled: false },
              }}
            />
          </>
        ) : (
          <section className="flex-1 flex items-center justify-center">
            <FaLaptopCode className="icon-lg" />
          </section>
        )}
      </article>
    </>
  );
};

export default CodeEditor;
