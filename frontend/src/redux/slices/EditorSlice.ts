import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editorWidth: 2000,
  editorHeight: 900,
  activeSection: null,
  
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
    setSideBarOpt: (state, action) => {
      state.sideBarOpt = action.payload;
    },
  },
});

export const {
  setEditorHeight,
  setEditorWidth,
  setActiveSection,
  setSideBarOpt,
} = editorSlice.actions;
export default editorSlice.reducer;
