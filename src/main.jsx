import { StrictMode } from "react";
import "./styles/main.scss";
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
      .then((reg) => {
        console.log("✅ SW enregistré :", reg.scope);

        // Détecte les mises à jour en attente
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // Une nouvelle version est là ! On force le reload.
                console.log("Nouvelle DA détectée, mise à jour...");
                window.location.reload();
              }
            }
          };
        };
      })
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