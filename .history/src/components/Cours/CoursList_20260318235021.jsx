import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CoursList({ section }) {
  const { theme, darkMode, deleteQuestion, updateQuestion } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing]   = useState(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [saving, setSaving]     = useState(false);

  const acc = section.color;

  function renderAnswer(text) {
    return text.split("\n").map((line, i) => {
      let color = darkMode ? "#94a3b8" : "#5c4a30";
      let weight = 400;
      if (line.startsWith("⚠️"))   { color = "#fb923c"; }
      else if (line.match(/^(FROM|WORKDIR|COPY|RUN|CMD|SELECT|UPDATE|CREATE|BEGIN|COMMIT)/)) { color = acc; weight = 500; }
      else if (line.trim().startsWith("//") || line.trim().startsWith("#")) { color = theme.muted; }
      else if (line.trim().startsWith("→") || line.trim().startsWith("-")) { color = darkMode ? "#7dd3fc" : "#7c5c2e"; }
      return <span key={i} style={{ color, fontWeight: weight }}>{line}{"\n"}</span>;
    });
  }

  async function saveEdit(sectionId, questionId) {
    setSaving(true);
    try {
      await updateQuestion({ sectionId, questionId, question: editForm.question, answer: editForm.answer });
      setEditing(null);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(sectionId, questionId) {
    if (!confirm("Supprimer cette question ?")) return;
    await deleteQuestion({ sectionId, questionId });
    setExpanded(null);
  }

  if (!section.content.length) return (
    <div style={{
      textAlign: "center",
      color: theme.muted,
      padding: "60px 20px",
      background: theme.card,
      borderRadius: 16,
      border: `1px dashed ${theme.border}`,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: theme.textSub, marginBottom: 6 }}>
        Aucune question ici
      </div>
      <div style={{ fontSize: 12 }}>
        Utilise <span style={{ color: acc }}>➕ Ajouter</span> pour en créer
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {section.content.map((item, i) => {
        const open = expanded === i;
        return (
          <div
            key={item.id ?? i}
            className="card-q"
            style={{
              border: `1.5px solid ${open ? acc + "70" : theme.border}`,
              borderRadius: 12,
              background: open
                ? (darkMode ? theme.cardHover : theme.card)
                : theme.card,
              overflow: "hidden",
              boxShadow: open ? `0 0 20px ${acc}15` : theme.shadowCard,
            }}
          >
            {/* Header */}
            <button
              onClick={() => { setExpanded(open ? null : i); setEditing(null); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.text,
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              {/* Numéro */}
              <span style={{
                flexShrink: 0,
                width: 24, height: 24,
                borderRadius: 6,
                background: open ? acc : theme.border,
                color: open ? (darkMode ? "#000" : "#fff") : theme.muted,
                fontSize: 10,
                fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                marginTop: 1,
              }}>
                {i + 1}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
                  {item.custom && (
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      background: acc + "25",
                      color: acc,
                      borderRadius: 4,
                      padding: "2px 6px",
                      letterSpacing: 0.5,
                    }}>CUSTOM</span>
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{item.q}</span>
              </div>

              <span style={{
                flexShrink: 0,
                color: open ? acc : theme.muted,
                fontSize: 10,
                transition: "transform 0.2s",
                transform: open ? "rotate(180deg)" : "none",
                marginTop: 4,
              }}>
                ▼
              </span>
            </button>

            {/* Contenu */}
            {open && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${theme.border}` }}>
                {editing !== item.id ? (
                  <>
                    <pre style={{
                      marginTop: 14,
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                      fontSize: 12,
                      lineHeight: 2,
                      padding: "14px 16px",
                      background: darkMode ? "#060912" : "#f5efe3",
                      borderRadius: 10,
                      border: `1px solid ${theme.border}`,
                    }}>
                      {renderAnswer(item.a)}
                    </pre>

                    {item.custom && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                          onClick={() => { setEditing(item.id); setEditForm({ question: item.q, answer: item.a }); }}
                          style={{
                            padding: "5px 14px",
                            background: "transparent",
                            border: `1px solid ${acc}50`,
                            borderRadius: 6,
                            color: acc,
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                          }}
                        >✏️ Modifier</button>
                        <button
                          onClick={() => handleDelete(section.id, item.id)}
                          style={{
                            padding: "5px 14px",
                            background: "transparent",
                            border: "1px solid #ef444450",
                            borderRadius: 6,
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                          }}
                        >🗑 Supprimer</button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={editForm.question}
                      onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))}
                      style={{
                        padding: "9px 12px",
                        background: theme.input,
                        border: `1.5px solid ${acc}`,
                        borderRadius: 8,
                        color: theme.text,
                        fontSize: 13,
                        fontFamily: "inherit",
                      }}
                    />
                    <textarea
                      rows={6}
                      value={editForm.answer}
                      onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))}
                      style={{
                        padding: "9px 12px",
                        background: theme.input,
                        border: `1.5px solid ${acc}`,
                        borderRadius: 8,
                        color: theme.text,
                        fontSize: 12,
                        fontFamily: "inherit",
                        resize: "vertical",
                        lineHeight: 1.7,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => saveEdit(section.id, item.id)}
                        disabled={saving}
                        style={{
                          padding: "7px 18px",
                          background: acc,
                          border: "none",
                          borderRadius: 8,
                          color: darkMode ? "#000" : "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      >{saving ? "…" : "💾 Sauvegarder"}</button>
                      <button
                        onClick={() => setEditing(null)}
                        style={{
                          padding: "7px 14px",
                          background: "transparent",
                          border: `1px solid ${theme.border}`,
                          borderRadius: 8,
                          color: theme.muted,
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      >Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}