import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext";
import App from "./App.jsx";

// ── Service Worker (PWA) ─────────────────────────────────────
// Le plugin vite-plugin-pwa génère automatiquement sw.js dans dist/.
// On l'enregistre ici pour activer le mode hors ligne.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("✅ SW enregistré :", reg.scope))
      .catch((err) => console.warn("⚠️ SW non enregistré :", err));
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);