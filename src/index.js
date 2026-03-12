import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalProvider } from "./store/GlobalContext";
import { ToastProvider } from "./components/atoms/Toast/ToastProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GlobalProvider>
  </React.StrictMode>,
);
