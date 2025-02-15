import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateContArg,
  CreateContRes,
  RunContArg,
  RunContRes,
} from "../../utility/Types";

export const containerApi = createApi({
  reducerPath: "containerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/container" }),
  endpoints: (builder) => ({
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
  }),
});

interface TerminalStateType {
  containerID: string | null;
  containerOutput: string;
  currentLang: string | null;
  staterCode: string | null;
}

const initialState: TerminalStateType = {
  containerID: null,
  containerOutput: "",
  currentLang: null,
  staterCode: null,
};

const TerminalSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    setContainerID: (state, action) => {
      state.containerID = action.payload;
    },
    setContainerOutput: (state, action) => {
      state.containerOutput = action.payload;
    },
    setCurrentLang: (state, action) => {
      const { name, code } = action.payload;
      state.currentLang = name;
      state.staterCode = code;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      containerApi.endpoints.runContainer.matchFulfilled,
      (state, action) => {
        state.containerOutput = action.payload.output;
      }
    );
  },
});

export const { useCreateContainerMutation, useRunContainerMutation } =
  containerApi;
export const { setContainerID, setContainerOutput, setCurrentLang } =
  TerminalSlice.actions;
export default TerminalSlice.reducer;
