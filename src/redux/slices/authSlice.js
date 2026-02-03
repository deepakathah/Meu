import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  action: "",
  user_id: null, 
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {


    // OTP send reducers
    sendOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess: (state) => {
      state.loading = false;
      state.otpSent = true;
    },
    sendOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // OTP verify reducers
    verifyOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpVerified = true;
      state.token = action.payload.token;
      state.action = action.payload.action;
      state.user_id = action.payload.user_id;
      state.user = action.payload.user;
      AsyncStorage.setItem('token', action.payload.token);
    },
    verifyOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.action = null;
      state.user_id = null;
      state.user = null;
    },

    logout: (state) => {
      state.token = null;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.action = null;
      state.user_id = null;
      state.user = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('confirmSchedule');
    },
  },
});

export const {
  sendOtpRequest, sendOtpSuccess, sendOtpFailure,
  verifyOtpRequest, verifyOtpSuccess, verifyOtpFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
