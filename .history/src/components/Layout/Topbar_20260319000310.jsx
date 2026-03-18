import { useApp } from "../../context/AppContext";

export default function Topbar({ isMobile, sidebarOpen, setSidebarOpen, section }) {
  const { darkMode, setDarkMode, theme } = useApp();

  const lineStyle = (transform) => ({
    display: "block",
    width: 18,
    height: 2,
    background: theme.textSub,
    borderRadius: 2,
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    ...transform,
  });

  return (
    <header style={{
      height: 56,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.card,
      position: "sticky",
      top: 0,
      zIndex: 10,
      gap: 12,
      backdropFilter: "blur(12px)",
    }}>

      {/* Burger */}
      <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      style={{
        background: sidebarOpen ? `${t.muted}15` : "transparent",
        border: "none",
        cursor: "pointer",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        borderRadius: "8px",
        transition: "background 0.2s",
        width: "36px",
        height: "36px",
      }}
    >
      {/* Barre du haut */}
      <span style={barStyle({
        transform: sidebarOpen 
          ? "rotate(-45deg) translate(-2px, 2px)" // Forme <
          : "rotate(45deg) translate(2px, 2px)"   // Forme >
      })} />
      
      {/* Barre du bas */}
      <span style={barStyle({
        transform: sidebarOpen 
          ? "rotate(45deg) translate(-2px, -2px)" // Forme <
          : "rotate(-45deg) translate(2px, -2px)"  // Forme >
      })} />
    </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28,
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
          boxShadow: "0 2px 8px rgba(56,189,248,0.3)",
        }}>
          💼
        </div>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? 13 : 15,
            background: "linear-gradient(90deg, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 0.5,
          }}>
            PREP ENTRETIEN
          </div>
          {!isMobile && (
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: 1 }}>
              ALTERNANCE · BACHELOR 1 à 3
            </div>
          )}
        </div>
      </div>

      {/* Section active (centre) */}
      {section && (
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 20,
            background: section.color + "18",
            border: `1px solid ${section.color}40`,
            fontSize: 11,
            color: section.color,
            fontWeight: 600,
          }}>
            {section.icon} {!isMobile && section.label}
          </span>
        </div>
      )}

      {/* Toggle thème */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: theme.bgAlt,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: "5px 12px",
          cursor: "pointer",
          color: theme.textSub,
          fontSize: 11,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}