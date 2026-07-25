import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { App } from "@/App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
