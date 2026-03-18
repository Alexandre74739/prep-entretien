import { useApp } from "../../context/AppContext";

export default function Sidebar({ activeId, onSelect }) {
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
      <div style={{
        fontSize: 9,
        color: theme.muted,
        letterSpacing: 2,
        fontWeight: 600,
        padding: "0 8px",
        marginBottom: 8,
        fontFamily: "'Syne', sans-serif",
      }}>
        SECTIONS
      </div>

      {sections.map((s) => {
        const active = activeId === s.id;
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
              border: active
                ? `1.5px solid ${s.color}60`
                : `1.5px solid transparent`,
              background: active
                ? (darkMode ? s.color + "18" : s.color + "15")
                : "transparent",
              cursor: "pointer",
              color: active ? s.color : theme.textSub,
              fontWeight: active ? 600 : 400,
              textAlign: "left",
              fontSize: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Barre colorée gauche si actif */}
            {active && (
              <div style={{
                position: "absolute",
                left: 0, top: "20%", bottom: "20%",
                width: 3,
                borderRadius: 2,
                background: #,
                boxShadow: `0 0 8px ${s.color}`,
              }} />
            )}

            <span style={{
              fontSize: 16,
              filter: active ? "none" : "grayscale(0.3)",
              transition: "filter 0.2s",
            }}>
              {s.icon}
            </span>

            <span style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {s.label}
            </span>

            {/* Badge questions custom */}
            {customCount > 0 && (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                background: s.color + "30",
                color: s.color,
                borderRadius: 10,
                padding: "2px 6px",
                flexShrink: 0,
              }}>
                +{customCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}