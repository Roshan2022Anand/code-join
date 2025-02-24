import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  outputRes,
  RunContArg,
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
    runContainer: builder.mutation<outputRes, RunContArg>({
      query: (body) => ({
        url: "/run",
        method: "POST",
        body: {
          containerID: initialState.containerID,
          cmd: body.cmd,
          WorkingDir: body.WorkingDir,
        },
      }),
    }),
    getFileCode: builder.query<{ output: string }, string>({
      query: (body) => ({
        url: "/file",
        method: "GET",
        params: { containerID: initialState.containerID, fileLoc: body },
      }),
    }),
  }),
});
interface TerminalStateType {
  containerID: string | null;
  editorLang: string | null;
  editorCode: string | null;
  terminalLoc: string | null;
  terminalOutput: string | null;
  folderStructure: string | null;
  openedFile: string | null;
  runCmd: string | null;
}

const initialState: TerminalStateType = {
  //test case
  containerID:
    "c92f6d6305db3791f60ea0cd88836c75dc95868248c008b4e98fca52f0326c54",
  editorLang: null,
  editorCode: null,
  terminalLoc: null, //
  terminalOutput: null, //
  folderStructure: null, //
  openedFile: null,
  runCmd: null,
};

const TerminalSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
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
        state.terminalLoc = output[0].split("\r\n")[0];
        state.folderStructure = output[1];
      }
    );

    //handle fulfilled for get container
    builder.addMatcher(
      containerApi.endpoints.getContainer.matchFulfilled,
      (state, action) => {
        const { output } = action.payload;
        state.terminalLoc = output[0].split("\n")[0];
        state.folderStructure = output[1];
      }
    );

    //handle pending for run container
    builder.addMatcher(
      containerApi.endpoints.runContainer.matchPending,
      (state) => {
        state.terminalOutput = null;
      }
    );

    //handle fulfilled for run container
    builder.addMatcher(
      containerApi.endpoints.runContainer.matchFulfilled,
      (state, action) => {
        const output = [...action.payload.output];
        if (output.length === 1) state.terminalOutput = output[0];
        else {
          state.folderStructure = output.pop() as string;
          state.terminalLoc = output.pop()?.split("\n")[0] as string;
          state.terminalOutput = output.pop() || " ";
        }
      }
    );

    builder.addMatcher(
      containerApi.endpoints.getFileCode.matchFulfilled,
      (state, action) => {
        state.editorCode = action.payload.output;
      }
    );
  },
});

export const {
  useGetContainerQuery,
  useLazyGetContainerQuery,
  useLazyGetFileCodeQuery,
  useCreateContainerMutation,
  useRunContainerMutation,
} = containerApi;

export const { setContainerID, setOpenedFile } = TerminalSlice.actions;

export default TerminalSlice.reducer;
