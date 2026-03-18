// ─────────────────────────────────────────────────────────────
// src/components/Layout/Sidebar.jsx
// ─────────────────────────────────────────────────────────────

import { useApp } from "../../context/AppContext";

export default function Sidebar({ activeId, onSelect }) {
  const { sections, theme } = useApp();

  return (
    <nav
      style={{
        width: 175,
        borderRight: `1px solid ${theme.border}`,
        background: theme.card,
        overflowY: "auto",
        flexShrink: 0,
        padding: "8px 6px",
      }}
    >
      {sections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 10px",
              background: isActive ? section.color + "20" : "transparent",
              border: `1px solid ${isActive ? section.color + "60" : "transparent"}`,
              borderRadius: 6,
              cursor: "pointer",
              color: isActive ? section.color : theme.muted,
              fontWeight: isActive ? 600 : 400,
              textAlign: "left",
              fontSize: 12,
              marginBottom: 2,
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = section.color + "12";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            <span>{section.icon}</span>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {section.label}
            </span>
            {/* Badge si des questions custom existent */}
            {section.content.some((q) => q.custom) && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  background: section.color + "30",
                  color: section.color,
                  borderRadius: 3,
                  padding: "1px 4px",
                }}
              >
                +{section.content.filter((q) => q.custom).length}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}