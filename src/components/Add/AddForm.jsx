import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { IconInbox, IconDownload, IconZap, IconCheck, IconX } from "../ui/Icon";

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
  const [newSec, setNewSec] = useState({ label: "", icon: "devicon-react-original colored" });
  const [form, setForm]     = useState(EMPTY);
  const [msg, setMsg]       = useState(null); // { type: 'success'|'error', text: string }
  const [copied, setCopied] = useState(false);

  async function submit() {
    if (!form.question.trim() || !form.answer.trim()) {
      setMsg({ type: "error", text: "Question et réponse obligatoires." }); return;
    }
    let sectionId = target;
    if (isNew) {
      if (!newSec.label.trim()) { setMsg({ type: "error", text: "Donne un nom à la section." }); return; }
      sectionId = await addSection(newSec);
      setIsNew(false);
      onSectionCreated?.(sectionId);
    }
    const quizItem = form.addToQuiz && form.options.every((o) => o.trim())
      ? { question: form.question.trim(), options: form.options.map((o) => o.trim()), answer: form.correct, explanation: form.explanation.trim() || "Question ajoutée manuellement." }
      : null;

    await addQuestion({ sectionId, question: form.question.trim(), answer: form.answer.trim(), quizItem });
    setMsg({ type: "success", text: "Question sauvegardée !" });
    setForm(EMPTY);
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="add-form">

      {/* Intro */}
      <div className="add-form__intro">
        <div className="add-form__intro-icon"><IconInbox /></div>
        <p className="add-form__intro-text">
          Colle ici une question depuis une IA ou tes notes. Elle sera sauvegardée dans Supabase et visible partout.
        </p>
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
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
          <option value="__new__">＋ Nouvelle section…</option>
        </select>
      </div>

      {/* Nouvelle section */}
      {isNew && (
        <div className="new-section-panel">
          <label className="field-label">Nouvelle section</label>
          <div className="new-section-row">
            <input
              className="field-input"
              style={{ flex: 1 }}
              value={newSec.label}
              placeholder="Nom de la section…"
              onChange={(e) => setNewSec((s) => ({ ...s, label: e.target.value }))}
            />
            <input
              className="field-input"
              style={{ width: 220 }}
              value={newSec.icon}
              placeholder="Classe Devicon (ex: devicon-react-original)"
              onChange={(e) => setNewSec((s) => ({ ...s, icon: e.target.value }))}
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
          <label className="field-label">4 Options — clique la lettre pour marquer la bonne réponse</label>
          {form.options.map((opt, i) => (
            <div key={i} className="qcm-option-row">
              <button
                className={`qcm-letter${form.correct === i ? " is-correct" : ""}`}
                onClick={() => setForm((f) => ({ ...f, correct: i }))}
              >
                {["A","B","C","D"][i]}
              </button>
              <input
                className="field-input"
                style={{ flex: 1 }}
                value={opt}
                onChange={(e) => setForm((f) => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })}
                placeholder={`Option ${["A","B","C","D"][i]}`}
              />
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
      <button className="btn btn--primary btn--submit-main" onClick={submit}>
        <IconDownload />
        Sauvegarder la question
      </button>

      {/* Toast */}
      {msg && (
        <div className={`add-form__toast add-form__toast--${msg.type}`}>
          {msg.type === "success" ? <IconCheck /> : <IconX />}
          {msg.text}
        </div>
      )}

      {/* Prompt IA */}
      <div className="prompt-box">
        <div className="prompt-box__header">
          <div className="prompt-box__label">
            <IconZap />
            Prompt pour générer des questions
          </div>
          <button
            className={`prompt-box__copy${copied ? " is-copied" : ""}`}
            onClick={() => { navigator.clipboard.writeText(PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          >
            {copied ? <><IconCheck /> Copié</> : "Copier"}
          </button>
        </div>
        <pre className="prompt-box__text">{PROMPT}</pre>
      </div>

    </div>
  );
}
