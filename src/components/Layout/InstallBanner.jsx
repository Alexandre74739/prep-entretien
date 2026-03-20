// src/components/Layout/InstallBanner.jsx
//
// Affiche une bannière discrète pour inviter l'utilisateur
// à installer l'app sur son écran d'accueil (mobile/desktop).
//
// Le navigateur déclenche l'événement "beforeinstallprompt"
// quand l'app est éligible à l'installation PWA.
// On capture cet événement et on l'utilise au clic du bouton.

import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

export default function InstallBanner() {
    const { theme, darkMode } = useApp();
    const [prompt, setPrompt] = useState(null);  // event beforeinstallprompt
    const [visible, setVisible] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        // Vérifie si déjà installé (mode standalone = lancé depuis l'écran d'accueil)
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setInstalled(true);
            return;
        }

        // Capture l'event d'installation du navigateur
        const handler = (e) => {
            e.preventDefault();       // empêche la bannière native du navigateur
            setPrompt(e);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Quand l'app est installée
        window.addEventListener("appinstalled", () => {
            setInstalled(true);
            setVisible(false);
        });

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    async function handleInstall() {
        if (!prompt) return;
        prompt.prompt();                          // affiche la dialog native
        const { outcome } = await prompt.userChoice;
        if (outcome === "accepted") setVisible(false);
        setPrompt(null);
    }

    // Ne rien afficher si déjà installé ou pas éligible
    if (!visible || installed) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            borderRadius: 14,
            background: theme.card,
            border: "1.5px solid #38bdf840",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            maxWidth: 380,
            width: "calc(100% - 32px)",
            animation: "slideUp 0.3s ease",
        }}>
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

            {/* Icône */}
            <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, boxShadow: "0 2px 8px rgba(56,189,248,0.3)",
            }}>
                💼
            </div>

            {/* Texte */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700, fontSize: 12,
                    color: theme.text, marginBottom: 2,
                }}>
                    Installer l'app
                </div>
                <div style={{ fontSize: 10, color: theme.textSub }}>
                    Accès rapide · fonctionne hors ligne
                </div>
            </div>

            {/* Bouton installer */}
            <button
                onClick={handleInstall}
                style={{
                    padding: "7px 14px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                    color: "#000", fontWeight: 700, fontSize: 11,
                    cursor: "pointer", flexShrink: 0,
                    fontFamily: "inherit",
                }}
            >
                Installer
            </button>

            {/* Fermer */}
            <button
                onClick={() => setVisible(false)}
                style={{
                    background: "transparent", border: "none",
                    color: theme.muted, cursor: "pointer",
                    fontSize: 16, padding: "0 2px", flexShrink: 0,
                    lineHeight: 1,
                }}
            >
                ×
            </button>
        </div>
    );
}