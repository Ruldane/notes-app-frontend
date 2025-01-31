import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { 
  loginSuccess, 
  logoutSuccess, 
  setAuthStatus, 
  setAuthError,
  updateUser 
} = authSlice.actions;
export default authSlice.reducer;
