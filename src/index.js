import React from 'react';
import ReactDOM from 'react-dom/client';
import 'assets/global.assets.css';
import BaseRoute from "routes/global.routes.jsx";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <BrowserRouter>
    <BaseRoute />
  </BrowserRouter>
);


reportWebVitals();
