import { createSlice } from '@reduxjs/toolkit';
import { UserTokens } from '@services';
import Cookies from 'js-cookie';

interface SessionState {
  userTokens: UserTokens;
  isRefreshing: boolean;
}

const initialState: SessionState = {
  userTokens: { access_token: null, refresh_token: null },
  isRefreshing: false
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUserTokens: (state, action) => {
      Cookies.set('RefreshToken', action.payload.refresh_token);
      Cookies.set('AccessToken', action.payload.access_token);
      state.userTokens = action.payload;
    },
    eraseUserTokens: (state) => {
      Cookies.remove('RefreshToken');
      Cookies.remove('AccessToken');
      state.userTokens = { access_token: null, refresh_token: null }
    },
    setIsRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    }
  }
})

export const { setUserTokens, eraseUserTokens, setIsRefreshing } = sessionSlice.actions;

export default sessionSlice.reducer
