import { createSlice } from "@reduxjs/toolkit";
import { languagesOpt } from "../../utility/languages";

interface EditorState {
  editorWidth: number;
  editorHeight: number;
  activeSection: string | null;
  currentLang: string;
  staterCode: string;
  sideBarOpt: string | null;
}

const initialState: EditorState = {
  editorWidth: 2000,
  editorHeight: 900,
  activeSection: null,
  currentLang: "cpp",
  staterCode: languagesOpt["cpp"],
  sideBarOpt: null,
};

const editorSlice = createSlice({
  name: "resize",
  initialState,
  reducers: {
    setEditorWidth: (state, action) => {
      state.editorWidth = action.payload;
    },
    setEditorHeight: (state, action) => {
      state.editorHeight = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setCurrentLang: (state, action) => {
      const { name, code } = action.payload;
      state.currentLang = name;
      state.staterCode = code;
    },
    setSideBarOpt: (state, action) => {
      state.sideBarOpt = action.payload;
    },
  },
});

export const {
  setEditorHeight,
  setEditorWidth,
  setActiveSection,
  setCurrentLang,
  setSideBarOpt,
} = editorSlice.actions;
export default editorSlice.reducer;
