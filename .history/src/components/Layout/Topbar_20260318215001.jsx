// ─────────────────────────────────────────────────────────────
// src/components/Layout/Topbar.jsx
// ─────────────────────────────────────────────────────────────

import { useApp } from "../../context/AppContext";

export default function Topbar() {
  const { darkMode, setDarkMode, theme } = useApp();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 20px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.card,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>💼</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#38bdf8" }}>
            ALTERNANCE PREP
          </div>
          <div style={{ fontSize: 10, color: theme.muted }}>
            Entraînement technique · Licence 3
          </div>
        </div>
      </div>

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
          fontFamily: "inherit",
        }}
      >
        {darkMode ? "☀️ Clair" : "🌙 Sombre"}
      </button>
    </header>
  );
}