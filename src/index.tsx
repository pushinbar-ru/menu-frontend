import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import reducer from "./rootReducer";
import App from "./App";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));

const store = createStore(reducer, composedEnhancer);
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
