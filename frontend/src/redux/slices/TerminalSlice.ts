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

// .:
// one  three

// ./one:
// abc  two

// ./one/two:
// xyz

// ./three:
//convert this to json
// const a = {
//   one: {
//     abc: "file",
//     two: {
//       xyz: "file",
//     },
//   },
//   three: "file",
// };

interface TerminalStateType {
  containerID: string | null;
  containerOutput: string;
  currentLang: string | null;
  currentCode: string | null;
}

const initialState: TerminalStateType = {
  containerID: null,
  containerOutput: "",
  currentLang: null,
  currentCode: null,
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
        state.currentCode = output[1];
      }
    );

    //handle fulfilled for run container
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
