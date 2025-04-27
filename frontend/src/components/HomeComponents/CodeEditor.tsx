import { Editor, OnMount, useMonaco } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import useEditorService from "../../sockets/EditorSocket";
import { RiLoaderLine } from "react-icons/ri";
import RoomJoin from "./RoomJoin";
import RunBtn from "../helpers/RunBtn";

const CodeEditor = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { editorHeight, activeSection } = useSelector(
    (state: RootState) => state.editor
  );
  const { editorLang, editorCode, editorLoading } = useSelector(
    (state: RootState) => state.file
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
  const [editor, seteditor] =
    useState<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const handleEditorMount: OnMount = (editor) => {
    seteditor(editor);
  };

  useEditorService(editor); //hook for editor operations

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
          <RunBtn editor={editor} />
        </header>
        {editorCode !== null ? (
          <>
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
          <section className="flex-1 flex flex-col items-center justify-center">
            {editorLoading ? (
              <RiLoaderLine className="icon-lg animate-spin" />
            ) : (
              <RoomJoin />
            )}
          </section>
        )}
      </article>
    </>
  );
};

export default CodeEditor;
