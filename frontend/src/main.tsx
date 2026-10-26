import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";
import { ThemeProvider } from "./themes/ThemeProvider";
import "./styles.css";
import "./themes/themes.css";
import "./themes/themes-extra.css";
import "./themes/themes-more.css";

registerSW({ immediate: true });

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename || undefined}>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
