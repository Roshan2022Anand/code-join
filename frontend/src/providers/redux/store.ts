import { configureStore } from "@reduxjs/toolkit";
import editor from "./slices/editor";
import room from "./slices/room";
import file from "./slices/file";

export const store = configureStore({
  reducer: {
    editor,
    room,
    file,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
