import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './feachers/map/map';

export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
