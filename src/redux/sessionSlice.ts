import { createSlice } from '@reduxjs/toolkit';
import { UserTokens } from '@services';
import Cookies from 'js-cookie';

interface SessionState {
  userTokens: UserTokens;
  userRole: number;
  currentRole: number;
  isRefreshing: boolean;
}

const initialState: SessionState = {
  userTokens: { access_token: null, refresh_token: null},
  userRole: 0,
  currentRole: 0,
  isRefreshing: false
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUserTokens: (state, action) => {
      Cookies.set('RefreshToken', action.payload.refresh_token);
      Cookies.set('AccessToken', action.payload.access_token);
      state.userTokens = { access_token: action.payload.access_token, refresh_token: action.payload.refresh_token };
      state.userRole = action.payload.role;
      state.currentRole = action.payload.role;
    },
    eraseUserTokens: (state) => {
      Cookies.remove('RefreshToken');
      Cookies.remove('AccessToken');
      state.userTokens = { access_token: null, refresh_token: null };
      state.userRole = 0;
      state.currentRole = 0;
    },
    setRole: (state, payload) => {
      state.currentRole = payload.payload;
    },
    toggleRole: (state) => {
      state.currentRole = state.currentRole === 0 ? state.userRole : 0;
    },
    setIsRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    }
  }
});

export const { setUserTokens, eraseUserTokens, toggleRole, setIsRefreshing, setRole } = sessionSlice.actions;

export default sessionSlice.reducer;
