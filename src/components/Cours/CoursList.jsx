import { useState } from "react";
import { useApp } from "../../context/AppContext";

function renderAnswer(text) {
  return text.split("\n").map((line, i) => {
    let cls = "ans-default";
    if (line.startsWith("⚠️")) {
      cls = "ans-warn";
    } else if (line.match(/^(FROM|WORKDIR|COPY|RUN|CMD|SELECT|UPDATE|CREATE|BEGIN|COMMIT)/)) {
      cls = "ans-keyword";
    } else if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      cls = "ans-comment";
    } else if (line.trim().startsWith("→") || line.trim().startsWith("-")) {
      cls = "ans-arrow";
    }
    return (
      <span key={i} className={cls}>
        {line}{"\n"}
      </span>
    );
  });
}

export default function CoursList({ section }) {
  const { deleteQuestion, updateQuestion } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing]   = useState(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [saving, setSaving]     = useState(false);

  const accent = section.color;

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
    <div className="empty-state">
      <div className="empty-state__icon">📭</div>
      <div className="empty-state__title">Aucune question ici</div>
      <div className="empty-state__desc">
        Utilise <strong>＋ Ajouter</strong> pour en créer
      </div>
    </div>
  );

  return (
    <div className="cours-list" style={{ "--accent": accent }}>
      {section.content.map((item, i) => {
        const open = expanded === i;
        return (
          <div
            key={item.id ?? i}
            className={`cours-card${open ? " is-open" : ""}`}
          >
            {/* Header */}
            <button
              className="cours-card__header"
              onClick={() => { setExpanded(open ? null : i); setEditing(null); }}
            >
              <span className="cours-card__num">{i + 1}</span>

              <div className="cours-card__content">
                <div className="cours-card__meta">
                  {item.custom && <span className="badge badge--custom">Custom</span>}
                </div>
                <span className="cours-card__question">{item.q}</span>
              </div>

              <span className="cours-card__chevron">▼</span>
            </button>

            {/* Body */}
            {open && (
              <div className="cours-card__body">
                {editing !== item.id ? (
                  <>
                    <pre className="cours-card__answer">
                      {renderAnswer(item.a)}
                    </pre>

                    {item.custom && (
                      <div className="cours-card__actions">
                        <button
                          className="btn btn--outline"
                          onClick={() => { setEditing(item.id); setEditForm({ question: item.q, answer: item.a }); }}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn--danger"
                          onClick={() => handleDelete(section.id, item.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="cours-edit">
                    <input
                      className="field-input"
                      value={editForm.question}
                      onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))}
                    />
                    <textarea
                      className="field-textarea"
                      rows={6}
                      value={editForm.answer}
                      onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))}
                    />
                    <div className="cours-edit__actions">
                      <button
                        className="btn btn--primary"
                        onClick={() => saveEdit(section.id, item.id)}
                        disabled={saving}
                      >
                        {saving ? "…" : "Sauvegarder"}
                      </button>
                      <button
                        className="btn btn--outline"
                        onClick={() => setEditing(null)}
                      >
                        Annuler
                      </button>
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
