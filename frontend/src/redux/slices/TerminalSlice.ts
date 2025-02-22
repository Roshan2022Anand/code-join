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
    getContainer: builder.query<void, string>({
      query: (body) => ({
        url: `/?${body}`,
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
  currentLoc: string | null;
  terminalOutput: string;
  folderStructure: string | null;
  currentFile: string | null;
}

const initialState: TerminalStateType = {
  containerID: null,
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
  useGetContainerQuery,
  useCreateContainerMutation,
  useRunContainerMutation,
  useDeleteContainerMutation,
} = containerApi;

export const { setContainerID, setCurrentLang } = TerminalSlice.actions;

export default TerminalSlice.reducer;
