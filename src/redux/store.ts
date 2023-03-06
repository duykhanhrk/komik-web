import { configureStore } from '@reduxjs/toolkit'
import sessionSlice from './sessionSlice';
import themeSlice from './themeSlice'

const store = configureStore({
  reducer: {
    theme: themeSlice,
    session: sessionSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
