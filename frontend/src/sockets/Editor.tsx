import type * as Monaco from "monaco-editor";
import { useMyContext } from "../utility/MyContext";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMonaco } from "@monaco-editor/react";
import { setEditorCode, setLangOpt } from "../redux/slices/File";

const useEditorService = (
  editor: Monaco.editor.IStandaloneCodeEditor | null
) => {
  const dispatch = useDispatch();
  const { socket } = useMyContext();
  const { roomID } = useSelector((state: RootState) => state.room);
  const { openedFile, editorLang } = useSelector(
    (state: RootState) => state.file
  );
  const monaco = useMonaco();

  //get the code for the selected file
  useEffect(() => {
    if (!openedFile) return;
    socket?.emit("get-file-content", { roomID, openedFile });
  }, [openedFile, socket, roomID]);

  //to listen for get and set editor value
  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners("get-file-content")) return;
    socket.on("set-editor-value", ({ code, editorLang }) => {
      dispatch(setLangOpt(editorLang));
      dispatch(setEditorCode(code));
    });

    socket.on("get-member-content", (socketID) => {
      const code = editor?.getValue();

      if (!code) return;
      socket.emit("set-member-content", { socketID, code, editorLang });
    });
  }, [socket, editor, dispatch, editorLang]);

  const isRemoteUpdate = useRef(false);
  useEffect(() => {
    if (!socket || !editor || !monaco) return;
    if (socket.hasListeners("editor-content-update")) return;

    //listen for editor-content-update event from server
    socket.on(
      "editor-content-update",
      ({
        range,
        text,
        openedFile: filename,
      }: {
        range: Monaco.IRange;
        text: string;
        openedFile: string;
      }) => {
        if (openedFile !== filename) return;

        isRemoteUpdate.current = true;
        const { startColumn, startLineNumber, endColumn, endLineNumber } =
          range;
        const model = editor.getModel();

        model?.applyEdits([
          {
            range: new monaco.Range(
              startLineNumber,
              startColumn,
              endLineNumber,
              endColumn
            ),
            text,
            forceMoveMarkers: true,
          },
        ]);

        //reset the falg
        setTimeout(() => {
          isRemoteUpdate.current = false;
        }, 0);
      }
    );

    //emit keypress event to server
    const disposable = editor.onDidChangeModelContent((e) => {
      if (isRemoteUpdate.current) return;
      const { range, text } = e.changes[0];
      socket?.emit("editor-keypress", { range, text, roomID, openedFile });
    });

    return () => {
      socket.off("editor-content-update");
      disposable?.dispose();
    };
  }, [socket, editor, monaco, roomID, openedFile]);
};

export default useEditorService;
