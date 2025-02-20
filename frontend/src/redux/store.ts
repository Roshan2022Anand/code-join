import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/EditorSlice";
import terminalReducer, { containerApi } from "./slices/TerminalSlice";
import fileReducer from "./slices/FilesSlice";

export const store = configureStore({
  reducer: {
    [containerApi.reducerPath]: containerApi.reducer,
    editor: editorReducer,
    terminalS: terminalReducer,
    files: fileReducer,
  },
  //@ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(containerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
