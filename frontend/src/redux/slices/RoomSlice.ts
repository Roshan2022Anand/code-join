import { createSlice } from "@reduxjs/toolkit";

interface RoomState {
  userName: string | null;
  email: string | null;
  profile: string | null;
}

const initialState: RoomState = {
  userName: null,
  email: null,
  profile: null,
};
const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setBasicDetails: (state, action) => {
      const { name, email, profile } = action.payload;
      state.userName = name;
      state.email = email;
      state.profile = profile;
    },
  },
});

export const { setBasicDetails } = RoomSlice.actions;
export default RoomSlice.reducer;
