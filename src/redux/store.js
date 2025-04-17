import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { feedReducer } from './reducers/feedReducer';
import { chatReducer } from './reducers/chatReducer';
import { marketReducer } from './reducers/marketReducer';
import { profileReducer } from './reducers/profileReducer';
import { appReducer } from './reducers/appReducer';
import authReducer from './reducers/authReducer';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Logger middleware
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  feed: feedReducer,
  chat: chatReducer,
  market: marketReducer,
  profile: profileReducer,
});

// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Ne persister que l'état d'authentification
  blacklist: [], // États à ne pas persister
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user'],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

// Création du persistor
const persistor = persistStore(store);

export { store, persistor };