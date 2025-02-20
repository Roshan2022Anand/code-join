import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  RunContArg,
  RunContRes,
} from "../../utility/Types";

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
          containerID:
            "a952629760b1549d8094059761f9b1443edfb559b67d2387b905b6ae7d727e69",
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
  currentLoc: string;
  terminalOutput: string;
  folderStructure: string | null;
}

const initialState: TerminalStateType = {
  containerID: null,
  currentLang: "javascript",
  currentCode: null,
  currentLoc: "Loading...",
  terminalOutput: "",
  folderStructure: null,
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
        state.currentLoc = output[0].split("\n")[0];
        state.folderStructure = output[1];
        state.currentCode = output[2];
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
