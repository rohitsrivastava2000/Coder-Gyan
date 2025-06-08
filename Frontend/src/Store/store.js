import { configureStore } from '@reduxjs/toolkit';
import userDetail from '../Features/userDetailSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// Step 1: Configure persist settings
const persistConfig = {
  key: 'root',
  storage,
};

// Step 2: Wrap your reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userDetail);

// Step 3: Create store with middleware adjustments
const store = configureStore({
  reducer: {
    app: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // These actions are used internally by redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Step 4: Export both store and persistor
export const persistor = persistStore(store);
export default store;
