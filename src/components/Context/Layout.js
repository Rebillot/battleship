import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { TurnProvider } from "./TurnContext";

ReactDOM.render(
  <React.StrictMode>
    <TurnProvider>
      <App />
    </TurnProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
