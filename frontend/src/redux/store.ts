import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/EditorSlice";
import fileReducer, { fileApi } from "./slices/FileSlice";
import roomReducer from "./slices/RoomSlice";
export const store = configureStore({
  reducer: {
    [fileApi.reducerPath]: fileApi.reducer,
    editor: editorReducer,
    room: roomReducer,
    file: fileReducer,
  },
  //@ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
