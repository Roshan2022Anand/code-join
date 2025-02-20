import { Editor, OnMount, useMonaco } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { FaCode, FaLaptopCode, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { useRunContainerMutation } from "../../redux/slices/TerminalSlice";
import { langExt } from "../../utility/languages";

const CodeEditor = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { editorHeight, activeSection } = useSelector(
    (state: RootState) => state.editor
  );
  const { containerID, currentLang, currentCode, currentFile } = useSelector(
    (state: RootState) => state.terminalS
  );

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

  //to run the program
  const [runPrg] = useRunContainerMutation();
  const handleRunPrg = async () => {
    if (editorRef.current && containerID && currentFile) {
      // const code = editorRef.current.getValue();
      const run = langExt[currentFile.split(".").pop() as string].runCmd;
      const cmd = [run, currentFile as string];
      runPrg({ containerID, cmd });
    }
  };

  return (
    <>
      <article
        className={`overflow-hidden rounded-md bg-secondary h-[90%] flex flex-col ${
          activeSection == "code" && "border-4 border-accent-300"
        }`}
        onClick={() => dispatch(setActiveSection("code"))}
        style={{
          height: `clamp(5%,${editorHeight}px,90%)`,
        }}
      >
        <header className="py-2 px-3 bg-soft flex gap-3 items-center justify-between">
          <FaCode className="icon-md" />
          <h3 className="mr-auto">CODE</h3>
          <button className="mr-2" onClick={handleRunPrg}>
            <FaPlay className="icon-md" />
          </button>
        </header>
        {currentLang && currentCode ? (
          <Editor
            height="1000px"
            language={currentLang}
            theme="accentTheme"
            value={currentCode}
            onMount={handleEditorMount}
            options={{
              fontSize: 20,
              minimap: { enabled: false },
            }}
          />
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
