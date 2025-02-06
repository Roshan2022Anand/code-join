import { createSlice } from "@reduxjs/toolkit";

const TerminalSlice = createSlice({
  name: "terminal",
  initialState: {
    containerID: null,
    containerOutput: "",
  },
  reducers: {
    setContainerID: (state, action) => {
      state.containerID = action.payload;
    },
    setContainerOutput: (state, action) => {
      state.containerOutput = action.payload;
    },
  },
});

export const { setContainerID, setContainerOutput } = TerminalSlice.actions;
export default TerminalSlice.reducer;
