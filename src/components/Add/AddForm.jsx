import { useState } from "react";
import { useApp } from "../../context/AppContext";

const EMPTY = {
  question: "", answer: "",
  addToQuiz: false,
  options: ["", "", "", ""],
  correct: 0, explanation: "",
};

const PROMPT = `Génère 3 questions d'entretien de niveau Bachelor 3 sur [SUJET].

Pour chaque question, fournis :
1. La question
2. La réponse détaillée (3-5 lignes, avec exemples de code si pertinent)
3. Un QCM avec 4 options (A, B, C, D) et la bonne réponse indiquée
4. Une explication courte de pourquoi c'est la bonne réponse`;

export default function AddForm({ currentSectionId, onSectionCreated }) {
  const { sections, addQuestion, addSection } = useApp();
  const [target, setTarget] = useState(currentSectionId);
  const [isNew, setIsNew]   = useState(false);
  const [newSec, setNewSec] = useState({ label: "", icon: "📝", color: "#f472b6" });
  const [form, setForm]     = useState(EMPTY);
  const [msg, setMsg]       = useState("");
  const [copied, setCopied] = useState(false);

  const accent = sections.find((s) => s.id === target)?.color || "#38bdf8";

  async function submit() {
    if (!form.question.trim() || !form.answer.trim()) {
      setMsg("⚠️ Question et réponse obligatoires."); return;
    }
    let sectionId = target;
    if (isNew) {
      if (!newSec.label.trim()) { setMsg("⚠️ Donne un nom à la section."); return; }
      sectionId = await addSection(newSec);
      setIsNew(false);
      onSectionCreated?.(sectionId);
    }
    const quizItem = form.addToQuiz && form.options.every((o) => o.trim())
      ? { question: form.question.trim(), options: form.options.map((o) => o.trim()), answer: form.correct, explanation: form.explanation.trim() || "Question ajoutée manuellement." }
      : null;

    await addQuestion({ sectionId, question: form.question.trim(), answer: form.answer.trim(), quizItem });
    setMsg("✅ Question sauvegardée !");
    setForm(EMPTY);
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680, "--accent": accent }}>

      {/* Intro */}
      <div className="form-intro">
        📌 Colle ici une question depuis une IA ou tes notes. Elle sera sauvegardée dans Supabase et visible partout.
      </div>

      {/* Section cible */}
      <div className="form-group">
        <label className="field-label">Section cible</label>
        <select
          className="field-select"
          value={isNew ? "__new__" : target}
          onChange={(e) => {
            if (e.target.value === "__new__") setIsNew(true);
            else { setIsNew(false); setTarget(e.target.value); }
          }}
        >
          {sections.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          <option value="__new__">＋ Nouvelle section…</option>
        </select>
      </div>

      {/* Nouvelle section */}
      {isNew && (
        <div className="new-section-panel">
          <label className="field-label">Nouvelle section</label>
          <div className="new-section-row">
            <input
              className="field-input field-input--icon"
              value={newSec.icon}
              onChange={(e) => setNewSec((s) => ({ ...s, icon: e.target.value }))}
            />
            <input
              className="field-input"
              style={{ flex: 1 }}
              value={newSec.label}
              placeholder="Nom de la section…"
              onChange={(e) => setNewSec((s) => ({ ...s, label: e.target.value }))}
            />
            <input
              type="color"
              className="field-input field-input--color"
              value={newSec.color}
              onChange={(e) => setNewSec((s) => ({ ...s, color: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Question */}
      <div className="form-group">
        <label className="field-label">Question *</label>
        <input
          className="field-input"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="ex: Quelle est la différence entre… ?"
        />
      </div>

      {/* Réponse */}
      <div className="form-group">
        <label className="field-label">Réponse *</label>
        <textarea
          className="field-textarea"
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          rows={7}
          placeholder="Colle ici la réponse détaillée…"
        />
      </div>

      {/* Toggle QCM */}
      <label className="toggle-label">
        <div
          className={`toggle-switch${form.addToQuiz ? " is-on" : ""}`}
          onClick={() => setForm((f) => ({ ...f, addToQuiz: !f.addToQuiz }))}
        >
          <div className="toggle-switch__thumb" />
        </div>
        <span className="toggle-text">Ajouter aussi en QCM (quiz)</span>
      </label>

      {/* Options QCM */}
      {form.addToQuiz && (
        <div className="qcm-options">
          <label className="field-label">4 Options — clique ✓ pour marquer la bonne réponse</label>
          {form.options.map((opt, i) => (
            <div key={i} className="qcm-option-row">
              <span className={`qcm-letter${form.correct === i ? " is-correct" : ""}`}>
                {["A","B","C","D"][i]}
              </span>
              <input
                className="field-input"
                style={{ flex: 1 }}
                value={opt}
                onChange={(e) => setForm((f) => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })}
                placeholder={`Option ${["A","B","C","D"][i]}`}
              />
              <button
                className={`qcm-check-btn${form.correct === i ? " is-correct" : ""}`}
                onClick={() => setForm((f) => ({ ...f, correct: i }))}
              >✓</button>
            </div>
          ))}
          <div className="form-group" style={{ marginTop: 4 }}>
            <label className="field-label">Explication (optionnel)</label>
            <input
              className="field-input"
              value={form.explanation}
              onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              placeholder="Pourquoi cette réponse est correcte…"
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button className="btn--submit" onClick={submit}>
        💾 Sauvegarder la question
      </button>

      {/* Toast */}
      {msg && (
        <div className={`form-toast form-toast--${msg.startsWith("✅") ? "success" : "error"}`}>
          {msg}
        </div>
      )}

      {/* Prompt IA */}
      <div className="prompt-box">
        <div className="prompt-box__header">
          <span className="prompt-box__label">💡 Prompt pour générer des questions</span>
          <button
            className={`prompt-box__copy${copied ? " is-copied" : ""}`}
            onClick={() => { navigator.clipboard.writeText(PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          >
            {copied ? "✅ Copié !" : "Copier"}
          </button>
        </div>
        <pre className="prompt-box__text">{PROMPT}</pre>
      </div>
    </div>
  );
}
