import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const { editorHeight, activeSection, currentLang, staterCode } = useSelector(
    (state: RootState) => state.editor
  );
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
        <header className="py-1 px-3 bg-soft flex gap-3 items-center">
          <FaCode className="icon-md" />
          <h3>CODE</h3>
        </header>
        <Editor
          height="1000px"
          language={currentLang}
          theme="accentTheme"
          value={staterCode}
          options={{
            fontSize: 20,
            minimap: { enabled: false },
          }}
        />
      </article>
    </>
  );
};

export default CodeEditor;
