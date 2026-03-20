import { useApp } from "../../context/AppContext";

export default function Sidebar({ activeId, onSelect, onInterviewQuiz }) {
  const { sections, theme, darkMode } = useApp();

  return (
    <nav style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      padding: "16px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      {/* Label */}
      <div style={{
        fontSize: 9, color: theme.muted,
        letterSpacing: 2, fontWeight: 600,
        padding: "0 8px", marginBottom: 8,
        fontFamily: "'Syne', sans-serif",
      }}>
        SECTIONS
      </div>

      {/* Liste des sections — s'étend autant que nécessaire */}
      {sections.map((s) => {
        const active      = activeId === s.id;
        const customCount = s.content.filter((q) => q.custom).length;

        return (
          <button
            key={s.id}
            className="nav-pill"
            onClick={() => onSelect(s.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              border: active ? `1.5px solid ${s.color}60` : `1.5px solid transparent`,
              background: active ? (darkMode ? s.color + "18" : s.color + "15") : "transparent",
              cursor: "pointer",
              color: active ? s.color : theme.textSub,
              fontWeight: active ? 600 : 400,
              textAlign: "left",
              fontSize: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {active && (
              <div style={{
                position: "absolute",
                left: 0, top: "20%", bottom: "20%",
                width: 3, borderRadius: 2,
                background: s.color,
                boxShadow: `0 0 8px ${s.color}`,
              }}/>
            )}
            <span style={{ fontSize: 16, filter: active ? "none" : "grayscale(0.3)", transition: "filter 0.2s" }}>
              {s.icon}
            </span>
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.label}
            </span>
            {customCount > 0 && (
              <span style={{
                fontSize: 9, fontWeight: 700,
                background: s.color + "30", color: s.color,
                borderRadius: 10, padding: "2px 6px", flexShrink: 0,
              }}>+{customCount}</span>
            )}
          </button>
        );
      })}

      {/* Séparateur + bouton Quiz Entretien — toujours en bas */}
      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${theme.border}, transparent)`,
          marginBottom: 10,
        }}/>

        <button
          className="nav-pill"
          onClick={onInterviewQuiz}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 12px",
            borderRadius: 10,
            border: activeId === "__interview__"
              ? "1.5px solid #f59e0b80"
              : "1.5px solid #f59e0b40",
            background: activeId === "__interview__"
              ? (darkMode ? "#f59e0b18" : "#f59e0b12")
              : (darkMode ? "#f59e0b0a" : "#f59e0b07"),
            cursor: "pointer",
            color: "#f59e0b",
            fontWeight: 600,
            textAlign: "left",
            fontSize: 12,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s",
          }}
        >
          {activeId === "__interview__" && (
            <div style={{
              position: "absolute",
              left: 0, top: "20%", bottom: "20%",
              width: 3, borderRadius: 2,
              background: "#f59e0b",
              boxShadow: "0 0 8px #f59e0b",
            }}/>
          )}
          <span style={{ fontSize: 16 }}>🎤</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>Quiz Entretien</div>
            <div style={{ fontSize: 9, color: "#f59e0b99", marginTop: 1 }}>10 questions · toutes sections</div>
          </div>
          {/* Pulse si pas encore essayé */}
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#f59e0b",
            boxShadow: "0 0 6px #f59e0b",
            flexShrink: 0,
            animation: "pulse-dot 2s infinite",
          }}/>
        </button>
      </div>
    </nav>
  );
}