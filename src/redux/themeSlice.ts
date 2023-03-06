import { createSlice } from '@reduxjs/toolkit'
import {ThemeMode} from '../constants/ColorScheme'

interface ThemeState {
  themeMode: ThemeMode
}

const initialState: ThemeState = {
  themeMode: localStorage.getItem('Theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      localStorage.setItem('Theme', action.payload);
      state.themeMode = action.payload;
    },
    toggleTheme: (state) => {
      localStorage.setItem('Theme', state.themeMode === 'light' ? 'dark' : 'light');
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    }
  }
})

export const { setTheme, toggleTheme } = themeSlice.actions

export default themeSlice.reducer
