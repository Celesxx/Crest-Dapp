// import { applyMiddleware, combineReducers, compose, createStore } from "redux";
// import { persistStore } from "redux-persist"
// import thunk from "redux-thunk";
// import rootReducer from "./reducers/root.reducer"

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

// export const persistor = persistStore(store)

// export default {store, persistor};


// import { persistStore } from "redux-persist"
import { configureStore,} from '@reduxjs/toolkit'
import loginReducer from "store/reducers/login.reducer.js"
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'


const reducers = combineReducers({
  login: loginReducer,           
 });
 
 const persistConfig = {
     key: 'root',
     storage
 };
 
 const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export default { store };
