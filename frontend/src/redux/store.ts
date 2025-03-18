import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/EditorSlice";
import fileReducer from "./slices/FileSlice";
import roomReducer from "./slices/RoomSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    room: roomReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
