import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  RunContArg,
  RunContRes,
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
    getContainer: builder.query<{ output: string[] }, string>({
      query: (body) => ({
        url: `/?containerID=${body}`,
        method: "GET",
      }),
    }),
    runContainer: builder.mutation<RunContRes, RunContArg>({
      query: (body) => ({
        url: "/run",
        method: "POST",
        body,
      }),
    }),
  }),
});
interface TerminalStateType {
  containerID: string | null;
  editorLang: string | null;
  editorCode: string | null;
  terminalLoc: string | null;
  terminalOutput: string;
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
  terminalLoc: null,
  terminalOutput: "",
  folderStructure: null,
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

    //handle fulfilled for run container
    builder.addMatcher(
      containerApi.endpoints.runContainer.matchFulfilled,
      (state, action) => {
        state.terminalOutput = action.payload.output;
      }
    );
  },
});

export const {
  useGetContainerQuery,
  useCreateContainerMutation,
  useRunContainerMutation,
} = containerApi;

export const { setContainerID, setOpenedFile } = TerminalSlice.actions;

export default TerminalSlice.reducer;
