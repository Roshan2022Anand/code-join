import { createSlice } from "@reduxjs/toolkit";
interface TerminalStateType {
  editorLang: string | null;
  editorCode: string | null;
  openedFile: string | null;
  runCmd: string | null;
  sideBarOpt: string | null;
  editorLoading: boolean;
}

const initialState: TerminalStateType = {
  editorLang: null,
  editorCode: null,
  openedFile: null,
  runCmd: null,
  sideBarOpt: null,
  editorLoading: false,
};

const FileSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setOpenedFile: (state, action) => {
      const { langObj } = action.payload;
      state.editorLang = langObj.name;
      state.runCmd = langObj.runCmd;
    },
    setSideBarOpt: (state, action) => {
      state.sideBarOpt = action.payload;
    },
    setEditorCode: (state, action) => {
      state.editorCode = action.payload;
    },
    setEditorLoading: (state, action) => {
      state.editorLoading = action.payload;
    },
  },
});

export const { setOpenedFile, setEditorCode, setSideBarOpt, setEditorLoading } =
  FileSlice.actions;

export default FileSlice.reducer;
