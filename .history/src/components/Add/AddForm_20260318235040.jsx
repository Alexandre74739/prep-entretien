import { useState } from "react";
import { useApp } from "../../context/AppContext";

const EMPTY = {
  question: "", answer: "",
  addToQuiz: false,
  options: ["", "", "", ""],
  correct: 0, explanation: "",
};

const PROMPT = `Génère 3 questions d'entretien de niveau Licence 3 sur [SUJET].

Pour chaque question, fournis :
1. La question
2. La réponse détaillée (3-5 lignes, avec exemples de code si pertinent)
3. Un QCM avec 4 options (A, B, C, D) et la bonne réponse indiquée
4. Une explication courte de pourquoi c'est la bonne réponse`;

export default function AddForm({ currentSectionId, onSectionCreated }) {
  const { sections, theme, darkMode, addQuestion, addSection } = useApp();
  const [target, setTarget]       = useState(currentSectionId);
  const [isNew, setIsNew]         = useState(false);
  const [newSec, setNewSec]       = useState({ label: "", icon: "📝", color: "#f472b6" });
  const [form, setForm]           = useState(EMPTY);
  const [msg, setMsg]             = useState("");
  const [copied, setCopied]       = useState(false);

  const acc = sections.find((s) => s.id === target)?.color || "#38bdf8";

  const inp = (extra = {}) => ({
    width: "100%",
    padding: "9px 12px",
    background: theme.input,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 12,
    fontFamily: "inherit",
    outline: "none",
    ...extra,
  });

  const label = (text) => (
    <div style={{
      fontSize: 10,
      color: theme.muted,
      letterSpacing: 1,
      fontWeight: 600,
      marginBottom: 5,
      fontFamily: "'Syne', sans-serif",
    }}>
      {text}
    </div>
  );

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>

      {/* Intro */}
      <div style={{
        padding: "14px 16px",
        borderRadius: 12,
        background: acc + "12",
        border: `1px solid ${acc}30`,
        fontSize: 12,
        color: theme.textSub,
        lineHeight: 1.7,
      }}>
        📌 Colle ici une question depuis une IA ou tes notes. Elle sera sauvegardée dans Supabase et visible partout.
      </div>

      {/* Section cible */}
      <div>
        {label("SECTION CIBLE")}
        <select
          value={isNew ? "__new__" : target}
          onChange={(e) => { e.target.value === "__new__" ? setIsNew(true) : (setIsNew(false), setTarget(e.target.value)); }}
          style={inp()}
        >
          {sections.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          <option value="__new__">➕ Nouvelle section…</option>
        </select>
      </div>

      {/* Nouvelle section */}
      {isNew && (
        <div style={{
          padding: 14, borderRadius: 12,
          border: `1.5px dashed ${acc}50`,
          background: acc + "08",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {label("NOUVELLE SECTION")}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newSec.icon}
              onChange={(e) => setNewSec((s) => ({ ...s, icon: e.target.value }))}
              style={{ ...inp(), width: 56, textAlign: "center", fontSize: 20 }}
            />
            <input
              value={newSec.label}
              placeholder="Nom de la section…"
              onChange={(e) => setNewSec((s) => ({ ...s, label: e.target.value }))}
              style={{ ...inp(), flex: 1 }}
            />
            <input
              type="color"
              value={newSec.color}
              onChange={(e) => setNewSec((s) => ({ ...s, color: e.target.value }))}
              style={{ ...inp(), width: 44, padding: 4, cursor: "pointer" }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      <div>
        {label("QUESTION *")}
        <input
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="ex: Quelle est la différence entre… ?"
          style={inp()}
        />
      </div>

      {/* Réponse */}
      <div>
        {label("RÉPONSE *")}
        <textarea
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          rows={7}
          placeholder="Colle ici la réponse détaillée…"
          style={{ ...inp(), resize: "vertical", lineHeight: 1.8 }}
        />
      </div>

      {/* Toggle quiz */}
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div
          onClick={() => setForm((f) => ({ ...f, addToQuiz: !f.addToQuiz }))}
          style={{
            width: 36, height: 20,
            borderRadius: 10,
            background: form.addToQuiz ? acc : theme.border,
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div style={{
            position: "absolute",
            top: 2, left: form.addToQuiz ? 18 : 2,
            width: 16, height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}/>
        </div>
        <span style={{ fontSize: 12, color: theme.textSub }}>Ajouter aussi en QCM (quiz)</span>
      </label>

      {/* Options QCM */}
      {form.addToQuiz && (
        <div style={{
          padding: 16, borderRadius: 12,
          border: `1px solid ${theme.border}`,
          background: darkMode ? "#060912" : "#f5efe3",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {label("4 OPTIONS — clique ✓ pour marquer la bonne réponse")}
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: form.correct === i ? acc + "30" : theme.border,
                color: form.correct === i ? acc : theme.muted,
                fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {["A","B","C","D"][i]}
              </span>
              <input
                value={opt}
                onChange={(e) => setForm((f) => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })}
                placeholder={`Option ${["A","B","C","D"][i]}`}
                style={{ ...inp({ flex: 1, borderColor: form.correct === i ? acc : theme.border }) }}
              />
              <button
                onClick={() => setForm((f) => ({ ...f, correct: i }))}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: `1px solid ${form.correct === i ? acc : theme.border}`,
                  background: form.correct === i ? acc + "20" : "transparent",
                  color: form.correct === i ? acc : theme.muted,
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >✓</button>
            </div>
          ))}
          <div style={{ marginTop: 4 }}>
            {label("EXPLICATION (optionnel)")}
            <input
              value={form.explanation}
              onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              placeholder="Pourquoi cette réponse est correcte…"
              style={inp()}
            />
          </div>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={submit}
        style={{
          padding: "13px",
          background: `linear-gradient(135deg, ${acc}, ${acc}bb)`,
          border: "none",
          borderRadius: 12,
          color: darkMode ? "#000" : "#fff",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: 0.5,
          boxShadow: `0 4px 16px ${acc}40`,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 20px ${acc}50`; }}
        onMouseLeave={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 4px 16px ${acc}40`; }}
      >
        💾 Sauvegarder la question
      </button>

      {msg && (
        <div style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: msg.startsWith("✅") ? "#22c55e18" : "#fb923c18",
          border: `1px solid ${msg.startsWith("✅") ? "#22c55e50" : "#fb923c50"}`,
          color: msg.startsWith("✅") ? "#22c55e" : "#fb923c",
          fontSize: 12, textAlign: "center", fontWeight: 500,
        }}>
          {msg}
        </div>
      )}

      {/* Prompt IA */}
      <div style={{
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        border: `1px dashed ${theme.border}`,
        background: theme.card,
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: 10,
            color: acc,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: "'Syne', sans-serif",
          }}>
            💡 PROMPT POUR GÉNÉRER DES QUESTIONS
          </span>
          <button
            onClick={() => { navigator.clipboard.writeText(PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: `1px solid ${acc}50`,
              background: copied ? acc + "20" : "transparent",
              color: acc,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            {copied ? "✅ Copié !" : "Copier"}
          </button>
        </div>
        <pre style={{
          fontSize: 11,
          color: theme.textSub,
          whiteSpace: "pre-wrap",
          lineHeight: 1.8,
          margin: 0,
        }}>
          {PROMPT}
        </pre>
      </div>
    </div>
  );
}