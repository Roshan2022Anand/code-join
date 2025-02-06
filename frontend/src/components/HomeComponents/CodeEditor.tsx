import { Editor, OnMount, useMonaco } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { FaCode, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import axios from "axios";
import { setContainerOutput } from "../../redux/slices/TerminalSlice";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const { editorHeight, activeSection, currentLang, staterCode } = useSelector(
    (state: RootState) => state.editor
  );
  const { containerID } = useSelector((state: RootState) => state.terminalS);
  const monaco = useMonaco();

  // Set custom theme for monaco editor
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
  const handleRunPrg = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/container/run`, {
          containerID,
          code,
        });
        const { output } = (await res).data;
        dispatch(setContainerOutput(output));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <article
        className={`overflow-hidden rounded-md bg-secondary h-[90%] ${
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
        {currentLang && staterCode ? (
          <Editor
            height="1000px"
            language={currentLang}
            theme="accentTheme"
            value={staterCode}
            onMount={handleEditorMount}
            options={{
              fontSize: 20,
              minimap: { enabled: false },
            }}
          />
        ) : (
          <h1 className="h-1/2 content-center text-center">
            Select a language..
          </h1>
        )}
      </article>
    </>
  );
};

export default CodeEditor;
