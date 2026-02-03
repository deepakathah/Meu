import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  users: [],
};

const usersSlice = createSlice({
  name: "checkInUsers",
  initialState,
  reducers: {
    // Get Users reducers
    getUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users.push(action.payload.users);
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
