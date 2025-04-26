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
  sideBarOpt: "langopt",
  editorLoading: false,
};

const FileSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setLangOpt: (state, action) => {
      const { name, cmd } = action.payload;
      console.log(name, cmd);
      state.editorLang = name;
      state.runCmd = cmd;
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

export const { setLangOpt, setEditorCode, setSideBarOpt, setEditorLoading } =
  FileSlice.actions;

export default FileSlice.reducer;
