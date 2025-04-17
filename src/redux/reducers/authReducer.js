import { createSlice } from '@reduxjs/toolkit';

// État initial
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

// Slice d'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.isLoading = true;
      state.error = null;
      state.isAuthenticated = false;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      state.isAuthenticated = true;
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    }
  }
});

// Exporter les actions et le reducer
export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;