// src/components/Layout/Topbar.jsx
import { useApp } from "../../context/AppContext";

export default function Topbar({ isMobile, sidebarOpen, setSidebarOpen, section }) {
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
      {/* Gauche : burger + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Bouton burger toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Fermer les catégories" : "Ouvrir les catégories"}
          style={{
            background: "transparent",
            border: `1px solid ${theme.border}`,
            borderRadius: 6,
            padding: "5px 9px",
            cursor: "pointer",
            color: theme.muted,
            fontSize: 15,
            lineHeight: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <span style={{
            display: "block", width: 16, height: 2,
            background: theme.muted, borderRadius: 1,
            transition: "all 0.2s",
            transform: sidebarOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
          }}/>
          <span style={{
            display: "block", width: 16, height: 2,
            background: theme.muted, borderRadius: 1,
            opacity: sidebarOpen ? 0 : 1,
            transition: "opacity 0.2s",
          }}/>
          <span style={{
            display: "block", width: 16, height: 2,
            background: theme.muted, borderRadius: 1,
            transition: "all 0.2s",
            transform: sidebarOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
          }}/>
        </button>

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
      </div>

      {/* Centre : section active */}
      {section && (
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 500 }}>
          {section.icon} {!isMobile && section.label}
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
        {darkMode ? "☀️ Clair" : "🌙 Sombre"}
      </button>
    </header>
  );
}