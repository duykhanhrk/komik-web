import { createSlice } from '@reduxjs/toolkit';
import { Suggestion } from '@services';

interface KeywordsState {
  keywords: Array<Suggestion>;
}

const initialState: KeywordsState = {
  keywords: JSON.parse(localStorage.getItem('Keywords') || '[]')
};

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    addKeyword: (state, action) => {
      if (!state.keywords.find((item) => JSON.stringify(item) === JSON.stringify(action.payload))) {
        localStorage.setItem('Keywords', JSON.stringify([action.payload, ...state.keywords]));
        state.keywords = [action.payload, ...state.keywords];
      }
    },
    removeKeyword: (state, action) => {
      state.keywords = state.keywords.filter((item) => JSON.stringify(item) !== JSON.stringify(action.payload));
      console.log(action.payload);
      localStorage.setItem('Keywords', JSON.stringify(state.keywords));
    },
    easeKeywords: (state) => {
      state.keywords = [];
      localStorage.removeItem('Keywords');
    }
  }
});

export const { addKeyword, removeKeyword, easeKeywords } = keywordsSlice.actions;

export default keywordsSlice.reducer;
