import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./context";

createRoot(document.getElementById("root")!).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
