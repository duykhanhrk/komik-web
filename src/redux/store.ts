import { configureStore } from '@reduxjs/toolkit';
import sessionSlice from './sessionSlice';
import themeSlice from './themeSlice';
import keywordsSlice from './keywordsSlice';

const store = configureStore({
    reducer: {
        theme: themeSlice,
        session: sessionSlice,
        keywords: keywordsSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
