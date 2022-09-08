import React from 'react';
import ReactDOM from 'react-dom/client';
import 'assets/global.assets.css';
import BaseRoute from "routes/global.routes.jsx";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux";
import { store } from "store/store.js";
import { persistStore } from 'redux-persist'
import Loading from 'components/blocks/loading.components.jsx'
// import { Web3ContextProvider } from 'components/pages/test2';
import {UserProvider, UserConsumer} from 'userContext.js'
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

let persistor = persistStore(store);


root.render(
  <BrowserRouter>
    <UserProvider>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <BaseRoute />
        </PersistGate>
      </Provider>
		</UserProvider>
  </BrowserRouter>
);


reportWebVitals();
