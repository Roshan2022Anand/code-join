import { createSlice } from "@reduxjs/toolkit";
interface TerminalStateType {
  editorLang: string | null;
  editorCode: string | null;
  openedFile: string | null;
  runCmd: string | null;
  sideBarOpt: string | null;
  folderStructure: string | null;
}

const initialState: TerminalStateType = {
  editorLang: null,
  editorCode: null,
  openedFile: null,
  runCmd: null,
  // sideBarOpt: "fileopt",
  // test
  sideBarOpt: null,
  folderStructure: null,
};

const FileSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setOpenedFile: (state, action) => {
      const { langObj, openedFile } = action.payload;
      state.editorLang = langObj.name;
      state.runCmd = langObj.runCmd;
      state.openedFile = openedFile;
    },
    setSideBarOpt: (state, action) => {
      state.sideBarOpt = action.payload;
    },
    setFolderStructure: (state, action) => {
      state.folderStructure = action.payload;
    },
    setEditorCode: (state, action) => {
      state.editorCode = action.payload;
    },
  },
});

export const { setOpenedFile,setEditorCode, setSideBarOpt, setFolderStructure } =
  FileSlice.actions;

export default FileSlice.reducer;
