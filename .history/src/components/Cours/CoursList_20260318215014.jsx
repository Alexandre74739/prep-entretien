// ─────────────────────────────────────────────────────────────
// src/components/Cours/CoursList.jsx
// Affiche les questions/réponses d'une section en accordéon.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CoursList({ section }) {
  const { theme, darkMode, deleteQuestion } = useApp();
  const [expanded, setExpanded] = useState(null);

  const toggle = (i) => setExpanded(expanded === i ? null : i);

  // Colore certains patterns dans la réponse
  function renderAnswer(text) {
    return text.split("\n").map((line, i) => {
      let color = darkMode ? "#cbd5e1" : "#475569";
      if (line.startsWith("⚠️")) color = "#f97316";
      else if (line.match(/^(FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|BEGIN|COMMIT|SELECT|UPDATE|CREATE|ALTER)/))
        color = section.color;
      else if (line.trim().startsWith("#") || line.trim().startsWith("//"))
        color = theme.muted;
      else if (line.trim().startsWith("→") || line.trim().startsWith("*"))
        color = darkMode ? "#94a3b8" : "#64748b";

      return (
        <span key={i} style={{ color }}>
          {line}
          {"\n"}
        </span>
      );
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {section.content.map((item, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${expanded === i ? section.color + "80" : theme.border}`,
            borderRadius: 8,
            background: theme.card,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
        >
          {/* En-tête cliquable */}
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "13px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: theme.text,
              textAlign: "left",
              fontSize: 13,
              fontWeight: 500,
              gap: 12,
              fontFamily: "inherit",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.custom && (
                <span
                  style={{
                    fontSize: 9,
                    color: section.color,
                    border: `1px solid ${section.color}`,
                    borderRadius: 3,
                    padding: "1px 5px",
                    flexShrink: 0,
                  }}
                >
                  custom
                </span>
              )}
              {item.q}
            </span>
            <span style={{ color: section.color, flexShrink: 0, fontSize: 10 }}>
              {expanded === i ? "▲" : "▼"}
            </span>
          </button>

          {/* Contenu accordéon */}
          {expanded === i && (
            <div
              style={{
                padding: "0 16px 16px",
                borderTop: `1px solid ${theme.border}`,
              }}
            >
              <pre
                style={{
                  marginTop: 14,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: 12,
                  lineHeight: 1.8,
                }}
              >
                {renderAnswer(item.a)}
              </pre>

              {/* Bouton supprimer (questions custom uniquement) */}
              {item.custom && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer cette question ?")) {
                      deleteQuestion({ sectionId: section.id, questionIndex: i });
                      setExpanded(null);
                    }
                  }}
                  style={{
                    marginTop: 12,
                    padding: "4px 10px",
                    background: "transparent",
                    border: "1px solid #ef444460",
                    borderRadius: 5,
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "inherit",
                  }}
                >
                  🗑 Supprimer cette question
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {section.content.length === 0 && (
        <div style={{ textAlign: "center", color: theme.muted, padding: 40, fontSize: 13 }}>
          Aucune question dans cette section.<br />
          <span style={{ color: section.color }}>
            Utilise l'onglet ➕ Ajouter pour en créer.
          </span>
        </div>
      )}
    </div>
  );
}