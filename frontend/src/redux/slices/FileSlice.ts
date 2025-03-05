import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getFileCodeArg, getFileCodeRes } from "../../utility/Types";

// API slice for container
export const fileApi = createApi({
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
  editorLang: string | null;
  editorCode: string | null;
  openedFile: string | null;
  runCmd: string | null;
  sideBarOpt: string | null;
  folderStructure: string | null;
}

const initialState: TerminalStateType = {
  editorLang: null,
  editorCode: null,
  openedFile: null,
  runCmd: null,
  // sideBarOpt: "fileopt",
  // test
  sideBarOpt: null,
  folderStructure: null,
};

const FileSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setOpenedFile: (state, action) => {
      const { langObj, openedFile, code } = action.payload;
      state.editorLang = langObj.name;
      state.runCmd = langObj.runCmd;
      state.openedFile = openedFile;
      state.editorCode = code;
    },
    setSideBarOpt: (state, action) => {
      state.sideBarOpt = action.payload;
    },
    setFolderStructure: (state, action) => {
      state.folderStructure = action.payload;
    },
  },
  extraReducers(builder) {
    //handle fulfilled for get file code
    builder.addMatcher(
      fileApi.endpoints.getFileCode.matchFulfilled,
      (state, action) => {
        state.editorCode = action.payload.output;
      }
    );
  },
});

export const { useLazyGetFileCodeQuery } = fileApi;

export const { setOpenedFile, setSideBarOpt, setFolderStructure } =
  FileSlice.actions;

export default FileSlice.reducer;
