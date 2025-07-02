import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMonaco } from "@monaco-editor/react";
import { convertToFolder } from "../utility/FolderConvertor";
import { FolderStructureType, WsData, wsEvent } from "../utility/Types";
import { setEditorCode, setOpenedFile } from "../providers/redux/slices/file";
import { useWsContext } from "../providers/context/config";
import { RootState } from "../providers/redux/store";

const useEditorService = (
  editor: Monaco.editor.IStandaloneCodeEditor | null
) => {
  const dispatch = useDispatch();
  const { socket, listeners, WsOn, WsOff, WsEmit } = useWsContext();
  const { roomID } = useSelector((state: RootState) => state.room);
  const { openedFile, folderStructure } = useSelector(
    (state: RootState) => state.file
  );
  const monaco = useMonaco();

  //get the code for the selected file
  useEffect(() => {
    if (!openedFile) return;
    const payload: wsEvent = {
      event: "get-file-content",
      data: { roomID, openedFile },
    };
    WsEmit(payload);
  }, [openedFile, socket, roomID, WsEmit]);

  //to listen for get and set editor value
  useEffect(() => {
    if (!socket || !editor) return;
    if (listeners.has("set-editor-value"))
      WsOn("set-editor-value", ({ output }: WsData) => {
        dispatch(setEditorCode(output));
      });

    WsOn("get-member-content", ({ socketID }: WsData) => {
      const code = editor.getValue();
      const payload: wsEvent = {
        event: "set-member-content",
        data: { socketID, code },
      };
      WsEmit(payload);
    });

    return () => {};
  }, [socket, editor, dispatch, WsOff, WsOn, listeners, WsEmit]);

  //check if  openedFile exists in the folderStructure
  useEffect(() => {
    if (!openedFile || !folderStructure) return;

    const { root } = convertToFolder(folderStructure);
    const target = openedFile.split("/");

    const checkExistence = (i: number, parent: FolderStructureType) => {
      if (!parent[target[i]]) {
        dispatch(
          setOpenedFile({
            openedFile: "",
            loc: "",
            langObj: { name: "plaintext", runCmd: "" },
          })
        );
        dispatch(setEditorCode(null));
        return;
      } else if (parent[target[i]] == "file") return;

      checkExistence(i + 1, parent[target[i]] as FolderStructureType);
    };

    checkExistence(0, root as FolderStructureType);
  }, [openedFile, folderStructure, dispatch]);

  const isRemoteUpdate = useRef(false);
  useEffect(() => {
    if (!socket || !editor || !monaco) return;
    if (listeners.has("editor-content-update")) return;

    //listen for editor-content-update event from server
    WsOn(
      "editor-content-update",
      ({ range, text, openedFile: filename }: WsData) => {
        if (openedFile !== filename) return;

        isRemoteUpdate.current = true;
        const { startColumn, startLineNumber, endColumn, endLineNumber } =
          range as Monaco.IRange;
        const model = editor.getModel();

        model?.applyEdits([
          {
            range: new monaco.Range(
              startLineNumber,
              startColumn,
              endLineNumber,
              endColumn
            ),
            text: text as string,
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
      const payload: wsEvent = {
        event: "editor-keypress",
        data: { range, text, roomID, openedFile },
      };
      WsEmit(payload);
    });

    return () => {
      WsOff("editor-content-update");
      disposable?.dispose();
    };
  }, [
    socket,
    editor,
    monaco,
    roomID,
    openedFile,
    WsOn,
    WsOff,
    WsEmit,
    listeners,
  ]);
};

export default useEditorService;
