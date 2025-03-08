import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./configs/locale.ts";
import App from "./App.tsx";
import "./assets/css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
