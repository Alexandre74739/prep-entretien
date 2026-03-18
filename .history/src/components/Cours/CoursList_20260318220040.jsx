// ─────────────────────────────────────────────────────────────
// client/src/components/Cours/CoursList.jsx
// Version mise à jour : boutons modifier et supprimer pour les
// questions custom, avec appel à l'API.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CoursList({ section }) {
  const { theme, darkMode, deleteQuestion, updateQuestion } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null); // id de la question en cours d'édition
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);

  function toggle(i) {
    setExpanded(expanded === i ? null : i);
    setEditing(null);
  }

  function startEdit(item) {
    setEditing(item.id);
    setEditForm({ question: item.q, answer: item.a });
  }

  async function saveEdit(sectionId, questionId) {
    setSaving(true);
    try {
      await updateQuestion({
        sectionId,
        questionId,
        question: editForm.question,
        answer: editForm.answer,
      });
      setEditing(null);
    } catch (e) {
      alert("Erreur lors de la modification : " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(sectionId, questionId) {
    if (!confirm("Supprimer cette question définitivement ?")) return;
    try {
      await deleteQuestion({ sectionId, questionId });
      setExpanded(null);
    } catch (e) {
      alert("Erreur lors de la suppression : " + e.message);
    }
  }

  function renderAnswer(text) {
    return text.split("\n").map((line, i) => {
      let color = darkMode ? "#cbd5e1" : "#475569";
      if (line.startsWith("⚠️")) color = "#f97316";
      else if (line.match(/^(FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|BEGIN|COMMIT|SELECT|UPDATE|CREATE|ALTER)/))
        color = section.color;
      else if (line.trim().startsWith("#") || line.trim().startsWith("//"))
        color = theme.muted;
      return (
        <span key={i} style={{ color }}>
          {line}{"\n"}
        </span>
      );
    });
  }

  if (section.content.length === 0) {
    return (
      <div style={{ textAlign: "center", color: theme.muted, padding: 40, fontSize: 13 }}>
        Aucune question dans cette section.<br />
        <span style={{ color: section.color }}>
          Utilise l'onglet ➕ Ajouter pour en créer.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {section.content.map((item, i) => (
        <div
          key={item.id ?? i}
          style={{
            border: `1px solid ${expanded === i ? section.color + "80" : theme.border}`,
            borderRadius: 8,
            background: theme.card,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
        >
          {/* En-tête */}
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
                <span style={{
                  fontSize: 9, color: section.color,
                  border: `1px solid ${section.color}`,
                  borderRadius: 3, padding: "1px 5px", flexShrink: 0,
                }}>
                  custom
                </span>
              )}
              {item.q}
            </span>
            <span style={{ color: section.color, flexShrink: 0, fontSize: 10 }}>
              {expanded === i ? "▲" : "▼"}
            </span>
          </button>

          {/* Contenu */}
          {expanded === i && (
            <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${theme.border}` }}>

              {/* Mode lecture */}
              {editing !== item.id && (
                <pre style={{
                  marginTop: 14, whiteSpace: "pre-wrap",
                  fontFamily: "inherit", fontSize: 12, lineHeight: 1.8,
                }}>
                  {renderAnswer(item.a)}
                </pre>
              )}

              {/* Mode édition */}
              {editing === item.id && (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    value={editForm.question}
                    onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))}
                    style={{
                      padding: "8px 10px", background: theme.input,
                      border: `1px solid ${section.color}`, borderRadius: 6,
                      color: theme.text, fontSize: 12, fontFamily: "inherit",
                    }}
                  />
                  <textarea
                    rows={6}
                    value={editForm.answer}
                    onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))}
                    style={{
                      padding: "8px 10px", background: theme.input,
                      border: `1px solid ${section.color}`, borderRadius: 6,
                      color: theme.text, fontSize: 12, fontFamily: "inherit",
                      resize: "vertical", lineHeight: 1.7,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => saveEdit(section.id, item.id)}
                      disabled={saving}
                      style={{
                        padding: "5px 14px", background: section.color,
                        border: "none", borderRadius: 6, color: "#fff",
                        cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                      }}
                    >
                      {saving ? "..." : "💾 Sauvegarder"}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        padding: "5px 14px", background: "transparent",
                        border: `1px solid ${theme.border}`, borderRadius: 6,
                        color: theme.muted, cursor: "pointer", fontSize: 12,
                        fontFamily: "inherit",
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Actions (questions custom uniquement) */}
              {item.custom && editing !== item.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      padding: "4px 10px", background: "transparent",
                      border: `1px solid ${section.color}60`, borderRadius: 5,
                      color: section.color, cursor: "pointer", fontSize: 11,
                      fontFamily: "inherit",
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(section.id, item.id)}
                    style={{
                      padding: "4px 10px", background: "transparent",
                      border: "1px solid #ef444460", borderRadius: 5,
                      color: "#ef4444", cursor: "pointer", fontSize: 11,
                      fontFamily: "inherit",
                    }}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}