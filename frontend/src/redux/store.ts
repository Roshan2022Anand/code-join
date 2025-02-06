import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/EditorSlice";
import terminalReducer from "./slices/TerminalSlice";
export const store = configureStore({
  reducer: {
    editor: editorReducer,
    terminalS: terminalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
