import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/ui/styles.css";
import { App } from "./App";

// biome-ignore lint/style/noNonNullAssertion: the element is in index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
