import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches
  );

  useEffect(() => {
    if (installed) return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [installed]);

  async function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setPrompt(null);
  }

  if (!visible || installed) return null;

  return (
    <div className="install-banner">
      <div className="install-banner__icon">💼</div>

      <div className="install-banner__text">
        <div className="install-banner__title">Installer l'app</div>
        <div className="install-banner__sub">Accès rapide · fonctionne hors ligne</div>
      </div>

      <button className="install-banner__btn" onClick={handleInstall}>
        Installer
      </button>

      <button className="install-banner__close" onClick={() => setVisible(false)} aria-label="Fermer">
        ×
      </button>
    </div>
  );
}
