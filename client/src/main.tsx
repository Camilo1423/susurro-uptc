import { store } from "@Redux";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "reflect-metadata";
import App from "./App";
import { applyStoredThemeToDocument } from "./context/theme";
import "./index.css";

// Aplica el tema guardado a <html> antes de renderizar, para que el loader de
// arranque salga ya con el tema correcto (sin flash del tema del sistema).
applyStoredThemeToDocument();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
