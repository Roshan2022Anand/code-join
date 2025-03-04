import type * as Monaco from "monaco-editor";
import { useMyContext } from "../utility/MyContext";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMonaco } from "@monaco-editor/react";

const useEditorService = (
  editor: Monaco.editor.IStandaloneCodeEditor | null
) => {
  const { socket } = useMyContext();
  const { roomID } = useSelector((state: RootState) => state.room);
  const monaco = useMonaco();

  // A ref to flag remote updates
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!socket || !editor || !monaco) return;
    if (socket.hasListeners("editor-content-update")) return;

    //listen for editor-content-update event from server
    socket.on(
      "editor-content-update",
      ({ range, text }: { range: Monaco.IRange; text: string }) => {
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
      socket?.emit("editor-keypress", { range, text, roomID });
    });

    return () => {
      socket.off("editor-content-update");
      disposable.dispose();
    };
  }, [socket, editor, monaco, roomID]);
};

export default useEditorService;
