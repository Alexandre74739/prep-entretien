// src/components/Quiz/InterviewQuiz.jsx
// Quiz entretien : 10 questions aléatoires toutes sections confondues

import { useState } from "react";
import { useApp } from "../../context/AppContext";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function InterviewQuiz() {
  const { sections, theme, darkMode } = useApp();

  // Rassemble tous les QCM de toutes les sections avec leur section d'origine
  const allQcm = sections.flatMap((s) =>
    s.quiz.map((q) => ({ ...q, sectionLabel: s.label, sectionIcon: s.icon, sectionColor: s.color }))
  );

  const pick10 = () => shuffle(allQcm).slice(0, Math.min(10, allQcm.length));

  const [questions, setQuestions] = useState(() => pick10());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted]     = useState(false);

  const answered  = Object.keys(answers).length;
  const score     = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio     = questions.length > 0 ? score / questions.length : 0;
  const color     = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";
  const emoji     = ratio >= 0.8 ? "🏆" : ratio >= 0.6 ? "📈" : "💪";
  const msg       = ratio >= 0.8 ? "Excellent ! Tu es prêt(e) pour l'entretien."
                  : ratio >= 0.6 ? "Bonne base ! Relis les points en rouge."
                  : "Continue à t'entraîner, tu vas y arriver !";

  function continuer() {
    setQuestions(pick10());
    setAnswers({});
    setSubmitted(false);
  }

  // ── Écran d'accueil ──
  if (!started) return (
    <div style={{ maxWidth: 560 }}>
      {/* Hero */}
      <div style={{
        padding: "28px 28px",
        borderRadius: 20,
        background: darkMode
          ? "linear-gradient(135deg, #0f1117, #1a1d27)"
          : "linear-gradient(135deg, #faf6ee, #f0ebe0)",
        border: "2px solid #f59e0b50",
        boxShadow: "0 0 40px #f59e0b12",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Deco cercles */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "#f59e0b08", border: "1px solid #f59e0b20" }}/>
        <div style={{ position: "absolute", bottom: -30, right: 30, width: 80, height: 80, borderRadius: "50%", background: "#f59e0b05", border: "1px solid #f59e0b15" }}/>

        <div style={{ fontSize: 36, marginBottom: 12 }}>🎤</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 22,
          color: theme.text, marginBottom: 8,
        }}>
          Quiz Entretien
        </h2>
        <p style={{ fontSize: 12, color: theme.textSub, lineHeight: 1.8, marginBottom: 20 }}>
          Simule un vrai entretien technique. <strong style={{ color: "#f59e0b" }}>10 questions</strong> tirées
          aléatoirement parmi <strong style={{ color: "#f59e0b" }}>toutes les sections</strong> —
          HTML, CSS, JS, React, SQL, Git, Docker...
          <br/>Tu réponds à tout, puis tu vois la correction complète.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {[
            { label: "Questions", value: Math.min(10, allQcm.length), color: "#f59e0b" },
            { label: "Sections", value: sections.filter(s => s.quiz.length > 0).length, color: "#38bdf8" },
            { label: "QCM dispo", value: allQcm.length, color: "#818cf8" },
          ].map(({ label, value, color: c }) => (
            <div key={label} style={{
              padding: "10px 16px", borderRadius: 10,
              background: c + "15", border: `1px solid ${c}40`,
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: c }}>{value}</div>
              <div style={{ fontSize: 10, color: theme.muted }}>{label}</div>
            </div>
          ))}
        </div>

        {allQcm.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.muted, padding: "12px 16px", borderRadius: 10, background: theme.border + "40", border: `1px dashed ${theme.border}` }}>
            Aucun QCM disponible. Ajoute des questions via <span style={{ color: "#f59e0b" }}>➕ Ajouter</span> en cochant "Ajouter au quiz".
          </div>
        ) : (
          <button
            onClick={() => setStarted(true)}
            style={{
              padding: "13px 32px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              color: "#000",
              fontWeight: 700, fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: 0.5,
              boxShadow: "0 4px 20px #f59e0b50",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px #f59e0b60"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px #f59e0b50"; }}
          >
            Commencer le quiz →
          </button>
        )}
      </div>

      {/* Aperçu des sections disponibles */}
      <div style={{ fontSize: 10, color: theme.muted, letterSpacing: 1, fontWeight: 600, marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>
        SECTIONS INCLUSES
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sections.filter(s => s.quiz.length > 0).map((s) => (
          <span key={s.id} style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 11,
            background: s.color + "18", border: `1px solid ${s.color}40`,
            color: s.color, fontWeight: 500,
          }}>
            {s.icon} {s.label} · {s.quiz.length}
          </span>
        ))}
      </div>
    </div>
  );

  // ── Feedback final ──
  if (submitted) return (
    <div style={{ maxWidth: 560 }}>
      {/* Score */}
      <div style={{
        padding: "22px 24px", borderRadius: 16,
        background: color + "12", border: `2px solid ${color}50`,
        marginBottom: 22, display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: 44 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontSize: 12, color: theme.textSub, marginTop: 3 }}>{msg}</div>
        </div>
        {/* Jauge circulaire */}
        <div style={{ width: 60, height: 60, position: "relative", flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 60, height: 60 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke={theme.border} strokeWidth="3"/>
            <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${ratio * 94} 94`} strokeLinecap="round"/>
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color }}>
            {Math.round(ratio * 100)}%
          </span>
        </div>
      </div>

      {/* Correction */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {questions.map((q, i) => {
          const sel = answers[i];
          const ok  = sel === q.answer;
          const c   = ok ? "#22c55e" : "#ef4444";
          return (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: c + "0c", border: `1.5px solid ${c}40` }}>
              {/* Badge section */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                  background: q.sectionColor + "25", color: q.sectionColor,
                  border: `1px solid ${q.sectionColor}40`,
                }}>
                  {q.sectionIcon} {q.sectionLabel}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: ok ? 0 : 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, background: c, color: "#fff",
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{ok ? "✓" : "✗"}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: theme.text, lineHeight: 1.5 }}>{q.question}</span>
              </div>

              {!ok && (
                <div style={{ fontSize: 11, color: theme.textSub, marginLeft: 32, marginBottom: 6 }}>
                  Ta réponse : <span style={{ color: "#ef4444" }}>{q.options[sel] ?? "—"}</span>
                  {" · "}Bonne réponse : <span style={{ color: "#22c55e" }}>{q.options[q.answer]}</span>
                </div>
              )}
              <div style={{
                fontSize: 11, color: theme.textSub, marginLeft: 32,
                lineHeight: 1.6, padding: "8px 12px",
                background: darkMode ? "#060912" : "#f5efe3",
                borderRadius: 8, borderLeft: "3px solid #f59e0b",
                marginTop: 6,
              }}>
                💡 {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={continuer}
          style={{
            padding: "12px 24px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            color: "#000", fontWeight: 700, fontSize: 12,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 14px #f59e0b40",
          }}
        >▶ Continuer</button>
        <button
          onClick={() => { setStarted(false); setAnswers({}); setSubmitted(false); }}
          style={{
            padding: "12px 18px", borderRadius: 10,
            border: `1.5px solid ${theme.border}`,
            background: "transparent", color: theme.textSub,
            fontWeight: 500, fontSize: 12,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >← Menu</button>
      </div>
    </div>
  );

  // ── Questions ──
  return (
    <div style={{ maxWidth: 560 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setStarted(false)}
          style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "5px 12px", color: theme.textSub, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}
        >← Menu</button>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: theme.text }}>🎤 Quiz Entretien</div>
          <div style={{ fontSize: 10, color: theme.muted }}>Toutes sections · {questions.length} questions</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: i < answered ? "#f59e0b" : theme.border,
            transition: "background 0.2s",
          }}/>
        ))}
      </div>

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => {
          const sel = answers[i];
          return (
            <div key={i} style={{
              background: theme.card, borderRadius: 14, padding: "16px 18px",
              border: `1.5px solid ${sel !== undefined ? "#f59e0b60" : theme.border}`,
              boxShadow: theme.shadowCard,
            }}>
              {/* Badge section */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 20, fontSize: 9, fontWeight: 600,
                background: q.sectionColor + "20", color: q.sectionColor,
                border: `1px solid ${q.sectionColor}40`, marginBottom: 10,
              }}>
                {q.sectionIcon} {q.sectionLabel}
              </span>

              <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                  background: sel !== undefined ? "#f59e0b" : theme.border,
                  color: sel !== undefined ? "#000" : theme.muted,
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: theme.text }}>{q.question}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {q.options.map((opt, j) => (
                  <button key={j} className="opt-btn"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                    style={{
                      padding: "9px 14px",
                      background: sel === j ? "#f59e0b20" : "transparent",
                      border: `1.5px solid ${sel === j ? "#f59e0b" : theme.border}`,
                      borderRadius: 9, color: sel === j ? "#f59e0b" : theme.textSub,
                      cursor: "pointer", textAlign: "left", fontSize: 12,
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 5,
                      background: (sel === j ? "#f59e0b" : theme.border) + "40",
                      color: sel === j ? "#f59e0b" : theme.muted,
                      fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{["A","B","C","D"][j]}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => answered === questions.length && setSubmitted(true)}
          disabled={answered < questions.length}
          style={{
            padding: "12px 22px", borderRadius: 10, border: "none",
            background: answered < questions.length
              ? theme.border
              : "linear-gradient(135deg, #f59e0b, #f97316)",
            color: answered < questions.length ? theme.muted : "#000",
            fontWeight: 700, fontSize: 12,
            cursor: answered < questions.length ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: answered < questions.length ? "none" : "0 4px 14px #f59e0b40",
          }}
        >
          Valider · {answered}/{questions.length}
        </button>
        <button
          onClick={() => setStarted(false)}
          style={{ padding: "12px 18px", borderRadius: 10, border: `1.5px solid ${theme.border}`, background: "transparent", color: theme.textSub, fontWeight: 500, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
        >← Menu</button>
      </div>
    </div>
  );
}