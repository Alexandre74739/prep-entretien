// ─────────────────────────────────────────────────────────────
// src/components/Add/AddForm.jsx
//
// Formulaire pour ajouter une question (depuis une IA ou tes notes).
// Permet aussi de créer une nouvelle section.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";

const EMPTY_FORM = {
  question: "",
  answer: "",
  addToQuiz: false,
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
};

const PROMPT_TEMPLATE = `Génère 3 questions d'entretien de niveau Licence 3 sur [SUJET].

Pour chaque question, fournis :
1. La question
2. La réponse détaillée (3-5 lignes, avec exemples de code si pertinent)
3. Un QCM avec 4 options (A, B, C, D) et la bonne réponse indiquée
4. Une explication courte de pourquoi c'est la bonne réponse`;

export default function AddForm({ currentSectionId, onSectionCreated }) {
  const { sections, theme, addQuestion, addSection } = useApp();

  const [targetSection, setTargetSection] = useState(currentSectionId);
  const [isNewSection, setIsNewSection] = useState(false);
  const [newSection, setNewSection] = useState({ label: "", icon: "📝", color: "#f472b6" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const acc = sections.find((s) => s.id === targetSection)?.color || "#38bdf8";

  function updateOption(index, value) {
    setForm((f) => {
      const options = [...f.options];
      options[index] = value;
      return { ...f, options };
    });
  }

  function handleSubmit() {
    if (!form.question.trim() || !form.answer.trim()) {
      setMsg("⚠️ La question et la réponse sont obligatoires.");
      return;
    }

    let sectionId = targetSection;

    // Créer la section si nécessaire
    if (isNewSection) {
      if (!newSection.label.trim()) {
        setMsg("⚠️ Donne un nom à la nouvelle section.");
        return;
      }
      sectionId = addSection(newSection);
      setIsNewSection(false);
      setNewSection({ label: "", icon: "📝", color: "#f472b6" });
      onSectionCreated?.(sectionId);
    }

    // Construire l'item quiz si coché
    const quizItem =
      form.addToQuiz && form.options.every((o) => o.trim())
        ? {
            question: form.question.trim(),
            options: form.options.map((o) => o.trim()),
            answer: form.correct,
            explanation: form.explanation.trim() || "Question ajoutée manuellement.",
          }
        : null;

    addQuestion({
      sectionId,
      question: form.question.trim(),
      answer: form.answer.trim(),
      quizItem,
    });

    setMsg("✅ Question sauvegardée !");
    setForm(EMPTY_FORM);
    setTimeout(() => setMsg(""), 3000);
  }

  function copyPrompt() {
    navigator.clipboard.writeText(PROMPT_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    background: theme.input,
    border: `1px solid ${theme.border}`,
    borderRadius: 6,
    color: theme.text,
    fontSize: 12,
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 11,
    color: theme.muted,
    display: "block",
    marginBottom: 5,
    letterSpacing: 0.5,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6 }}>
        Colle ici une question générée par une IA ou issue de tes notes.
        Elle sera sauvegardée automatiquement dans localStorage.
      </p>

      {/* ── Section cible ── */}
      <div>
        <label style={labelStyle}>SECTION CIBLE</label>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={isNewSection ? "__new__" : targetSection}
            onChange={(e) => {
              if (e.target.value === "__new__") {
                setIsNewSection(true);
              } else {
                setIsNewSection(false);
                setTargetSection(e.target.value);
              }
            }}
            style={{ ...inputStyle, flex: 1 }}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.label}
              </option>
            ))}
            <option value="__new__">➕ Nouvelle section…</option>
          </select>
        </div>
      </div>

      {/* ── Nouvelle section ── */}
      {isNewSection && (
        <div
          style={{
            padding: 12,
            background: theme.hover,
            borderRadius: 8,
            border: `1px dashed ${theme.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, color: acc, fontWeight: 600 }}>
            NOUVELLE SECTION
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: "0 0 70px" }}>
              <label style={labelStyle}>ICÔNE</label>
              <input
                value={newSection.icon}
                onChange={(e) => setNewSection((s) => ({ ...s, icon: e.target.value }))}
                style={{ ...inputStyle, textAlign: "center", fontSize: 18 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>NOM</label>
              <input
                value={newSection.label}
                placeholder="ex: Node.js, TypeScript…"
                onChange={(e) => setNewSection((s) => ({ ...s, label: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "0 0 50px" }}>
              <label style={labelStyle}>COULEUR</label>
              <input
                type="color"
                value={newSection.color}
                onChange={(e) => setNewSection((s) => ({ ...s, color: e.target.value }))}
                style={{
                  ...inputStyle,
                  padding: 2,
                  height: 34,
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Question ── */}
      <div>
        <label style={labelStyle}>QUESTION *</label>
        <input
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="ex: Quelle est la différence entre… ?"
          style={inputStyle}
        />
      </div>

      {/* ── Réponse ── */}
      <div>
        <label style={labelStyle}>RÉPONSE *</label>
        <textarea
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          rows={6}
          placeholder="Colle ici la réponse (d'une IA ou ta propre explication)…"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
        />
      </div>

      {/* ── Option quiz ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id="addquiz"
          checked={form.addToQuiz}
          onChange={(e) => setForm((f) => ({ ...f, addToQuiz: e.target.checked }))}
          style={{ accentColor: acc, width: 14, height: 14 }}
        />
        <label htmlFor="addquiz" style={{ fontSize: 12, color: theme.muted, cursor: "pointer" }}>
          Ajouter aussi en QCM (quiz)
        </label>
      </div>

      {/* ── Options QCM ── */}
      {form.addToQuiz && (
        <div
          style={{
            padding: 14,
            background: theme.hover,
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>
            4 OPTIONS — clique sur ✓ pour marquer la bonne réponse
          </div>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  color: form.correct === i ? acc : theme.muted,
                  fontSize: 11,
                  width: 14,
                  flexShrink: 0,
                }}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              <input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${["A", "B", "C", "D"][i]}`}
                style={{
                  ...inputStyle,
                  flex: 1,
                  borderColor: form.correct === i ? acc : theme.border,
                }}
              />
              <button
                onClick={() => setForm((f) => ({ ...f, correct: i }))}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${form.correct === i ? acc : theme.border}`,
                  background: form.correct === i ? acc + "25" : "transparent",
                  color: form.correct === i ? acc : theme.muted,
                  cursor: "pointer",
                  fontSize: 11,
                  flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                ✓ correct
              </button>
            </div>
          ))}

          <div style={{ marginTop: 4 }}>
            <label style={labelStyle}>EXPLICATION (optionnel)</label>
            <input
              value={form.explanation}
              onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              placeholder="Pourquoi cette réponse est correcte…"
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* ── Bouton sauvegarder ── */}
      <button
        onClick={handleSubmit}
        style={{
          padding: 11,
          background: acc,
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit",
          marginTop: 4,
        }}
      >
        💾 Sauvegarder la question
      </button>

      {msg && (
        <div
          style={{
            color: msg.startsWith("✅") ? "#22c55e" : "#f97316",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {msg}
        </div>
      )}

      {/* ── Prompt IA ── */}
      <div
        style={{
          marginTop: 10,
          padding: 14,
          background: theme.hover,
          borderRadius: 8,
          border: `1px dashed ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: acc,
            fontWeight: 600,
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>💡 PROMPT À COPIER POUR GÉNÉRER DES QUESTIONS</span>
          <button
            onClick={copyPrompt}
            style={{
              padding: "3px 10px",
              background: acc + "25",
              border: `1px solid ${acc}`,
              borderRadius: 4,
              color: acc,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
            }}
          >
            {copied ? "✅ Copié !" : "Copier"}
          </button>
        </div>
        <pre
          style={{
            fontSize: 11,
            color: theme.muted,
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {PROMPT_TEMPLATE}
        </pre>
      </div>
    </div>
  );
}