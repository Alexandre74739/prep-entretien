// src/components/Layout/Sidebar.jsx
import { useApp } from "../../context/AppContext";

export default function Sidebar({ activeId, onSelect, isMobile }) {
  const { sections, theme } = useApp();

  return (
    <nav style={{
      width: "100%",
      height: "100%",
      background: theme.card,
      overflowY: "auto",
      padding: isMobile ? "12px 12px" : "8px 6px",
    }}>
      {/* Titre sur mobile */}
      {isMobile && (
        <div style={{
          fontSize: 11,
          color: theme.muted,
          letterSpacing: 1,
          marginBottom: 12,
          padding: "0 4px",
        }}>
          CHOISIR UNE SECTION
        </div>
      )}

      {/* Grille sur mobile, liste sur desktop */}
      <div style={{
        display: isMobile ? "grid" : "flex",
        gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
        flexDirection: isMobile ? undefined : "column",
        gap: isMobile ? 8 : 2,
      }}>
        {sections.map((section) => {
          const isActive = activeId === section.id;
          const customCount = section.content.filter((q) => q.custom).length;

          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "14px 12px" : "9px 10px",
                background: isActive ? section.color + "20" : "transparent",
                border: `1px solid ${isActive ? section.color + "60" : theme.border}`,
                borderRadius: 8,
                cursor: "pointer",
                color: isActive ? section.color : theme.muted,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                fontSize: isMobile ? 13 : 12,
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: isMobile ? 18 : 14 }}>{section.icon}</span>
              <span style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
              }}>
                {section.label}
              </span>
              {customCount > 0 && (
                <span style={{
                  fontSize: 9,
                  background: section.color + "30",
                  color: section.color,
                  borderRadius: 3,
                  padding: "1px 4px",
                  flexShrink: 0,
                }}>
                  +{customCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}