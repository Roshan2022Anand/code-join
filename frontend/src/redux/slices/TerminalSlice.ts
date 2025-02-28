import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  getFileCodeArg,
  getFileCodeRes,
  outputRes,
} from "../../utility/Types";

// API slice for container
export const containerApi = createApi({
  reducerPath: "containerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/container`,
  }),
  endpoints: (builder) => ({
    createContainer: builder.mutation<CreateContRes, CreateContArg>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    getContainer: builder.query<outputRes, string>({
      query: (body) => ({
        url: `/`,
        method: "GET",
        params: { containerID: body },
      }),
    }),
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
  containerID: string | null;
  editorLang: string | null;
  editorCode: string | null;
  terminalLoc: string;
  folderStructure: string | null;
  openedFile: string | null;
  runCmd: string | null;
}

const initialState: TerminalStateType = {
  buffer: "",
  //test case
  containerID:
    "591670ae1fe490dd59e32dc9ef67ccc87a629660cab8c69950a1413781dbc36d",
  // containerID: null,
  editorLang: null,
  editorCode: null,
  terminalLoc: "/root",
  folderStructure: null,
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
    setContainerID: (state, action) => {
      state.containerID = action.payload;
    },
    setOpenedFile: (state, action) => {
      const { langObj, openedFile } = action.payload;
      state.editorLang = langObj.name;
      state.runCmd = langObj.runCmd;
      state.openedFile = openedFile;
    },
  },
  extraReducers(builder) {
    //handle fulfilled for create container
    builder.addMatcher(
      containerApi.endpoints.createContainer.matchFulfilled,
      (state, action) => {
        const { containerID, output } = action.payload;
        state.containerID = containerID;
        state.folderStructure = output;
      }
    );

    //handle fulfilled for get container
    builder.addMatcher(
      containerApi.endpoints.getContainer.matchFulfilled,
      (state, action) => {
        state.folderStructure = action.payload.output;
      }
    );

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

export const {
  useGetContainerQuery,
  useLazyGetContainerQuery,
  useLazyGetFileCodeQuery,
  useCreateContainerMutation,
} = containerApi;

export const { setContainerID, setOpenedFile, setBuffer } =
  TerminalSlice.actions;

export default TerminalSlice.reducer;
