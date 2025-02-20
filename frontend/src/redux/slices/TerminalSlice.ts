import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  RunContArg,
  RunContRes,
} from "../../utility/Types";

const id ="3f6bae41878cf2893e60119bc21269aaa4a668c9fb6a88fdc6c196df6d4d119c"

//API slice for container
export const containerApi = createApi({
  reducerPath: "containerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/container`,
  }),
  endpoints: (builder) => ({
    testContainer: builder.mutation<{ output: string[] }, void>({
      query: () => ({
        url: "/test",
        method: "POST",
        body: {
          containerID:id,
        },
      }),
    }),
    createContainer: builder.mutation<CreateContRes, CreateContArg>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    runContainer: builder.mutation<RunContRes, RunContArg>({
      query: (body) => ({
        url: "/run",
        method: "POST",
        body,
      }),
    }),
    deleteContainer: builder.mutation<void, { containerID: string }>({
      query: (body) => ({
        url: "/",
        method: "DELETE",
        body,
      }),
    }),
  }),
});
interface TerminalStateType {
  containerID: string | null;
  currentLang: string | null;
  currentCode: string | null;
  currentLoc: string|null;
  terminalOutput: string;
  folderStructure: string | null;
  currentFile: string | null;
}

const initialState: TerminalStateType = {
  containerID: id,
  currentLang: "javascript",
  currentCode: null,
  currentLoc: null,
  terminalOutput: "",
  folderStructure: null,
  currentFile: "main.js",
};

const TerminalSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setContainerID: (state, action) => {
      state.containerID = action.payload;
    },
    setCurrentLang: (state, action) => {
      state.currentLang = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      containerApi.endpoints.testContainer.matchFulfilled,
      (state, action) => {
        const { output } = action.payload;
        console.log(output);
        state.currentFile = output[0]
        state.currentLoc = output[1].split("\n")[0];
        state.folderStructure = output[2];
        state.currentCode = output[3];
      }
    );

    //handle fulfilled for create container
    builder.addMatcher(
      containerApi.endpoints.createContainer.matchFulfilled,
      (state, action) => {
        const { containerID, output } = action.payload;
        state.containerID = containerID;
        state.folderStructure = output[0];
        state.currentCode = output[1];
        state.currentLoc = output[2];
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
  useTestContainerMutation,
  useCreateContainerMutation,
  useRunContainerMutation,
  useDeleteContainerMutation,
} = containerApi;

export const { setContainerID, setCurrentLang } = TerminalSlice.actions;

export default TerminalSlice.reducer;
