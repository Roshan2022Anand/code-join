import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/Editor";
import fileReducer from "./slices/File";
import roomReducer from "./slices/Room";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    room: roomReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
