import { createSlice } from "@reduxjs/toolkit";
interface TerminalStateType {
  editorLang: string | null;
  editorCode: string | null;
  sideBarOpt: string | null;
  editorLoading: boolean;
}

const initialState: TerminalStateType = {
  editorLang: null,
  editorCode: null,
  sideBarOpt: "langopt",
  editorLoading: false,
};

const FileSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setLangOpt: (state, action) => {
      state.editorLang = action.payload;
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

export const {
  setLangOpt,
  setEditorCode,
  setSideBarOpt,
  setEditorLoading,
} = FileSlice.actions;

export default FileSlice.reducer;
