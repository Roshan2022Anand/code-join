import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getFileCodeArg, getFileCodeRes } from "../../utility/Types";

// API slice for container
export const containerApi = createApi({
  reducerPath: "containerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/container`,
  }),
  endpoints: (builder) => ({
    getFileCode: builder.query<getFileCodeRes, getFileCodeArg>({
      query: (body) => ({
        url: "/file",
        method: "GET",
        params: body,
      }),
    }),
  }),
});

interface TerminalStateType {
  buffer: string;
  editorLang: string | null;
  editorCode: string | null;
  openedFile: string | null;
  runCmd: string | null;
}

const initialState: TerminalStateType = {
  buffer: "",
  editorLang: null,
  editorCode: null,
  openedFile: null,
  runCmd: null,
};

const TerminalSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setBuffer: (state, action) => {
      state.buffer = action.payload;
    },
    setOpenedFile: (state, action) => {
      const { langObj, openedFile } = action.payload;
      state.editorLang = langObj.name;
      state.runCmd = langObj.runCmd;
      state.openedFile = openedFile;
    },
  },
  extraReducers(builder) {
    //handle fulfilled for get file code
    builder.addMatcher(
      containerApi.endpoints.getFileCode.matchFulfilled,
      (state, action) => {
        const { output } = action.payload;
        if (output.includes("No such file or directory"))
          state.editorCode = null;
        else state.editorCode = output;
      }
    );
  },
});

export const { useLazyGetFileCodeQuery } = containerApi;

export const { setOpenedFile, setBuffer } =
  TerminalSlice.actions;

export default TerminalSlice.reducer;
