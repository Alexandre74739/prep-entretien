// src/components/Layout/Topbar.jsx
import { useApp } from "../../context/AppContext";

export default function Topbar({ isMobile, panelOpen, setPanelOpen, section }) {
  const { darkMode, setDarkMode, theme } = useApp();

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "11px 16px",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.card,
      position: "sticky",
      top: 0,
      zIndex: 10,
      gap: 10,
    }}>
      {/* Gauche : logo + toggle panneau (desktop) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>💼</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#38bdf8" }}>
            ALTERNANCE PREP
          </div>
          {!isMobile && (
            <div style={{ fontSize: 10, color: theme.muted }}>
              Entraînement technique · Licence 3
            </div>
          )}
        </div>

        {/* Bouton toggle panneau — desktop uniquement */}
        {!isMobile && (
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            title={panelOpen ? "Fermer le panneau" : "Ouvrir le panneau"}
            style={{
              marginLeft: 8,
              padding: "5px 10px",
              background: theme.border,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              color: theme.muted,
              fontSize: 14,
            }}
          >
            {panelOpen ? "◀" : "▶"}
          </button>
        )}
      </div>

      {/* Centre : section active sur mobile */}
      {isMobile && panelOpen && section && (
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 500 }}>
          {section.icon} {section.label}
        </div>
      )}

      {/* Droite : toggle thème */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: theme.border,
          border: "none",
          borderRadius: 6,
          padding: "6px 12px",
          cursor: "pointer",
          color: theme.text,
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}