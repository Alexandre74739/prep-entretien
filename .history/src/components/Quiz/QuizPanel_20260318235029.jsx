import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function QuizPanel({ section }) {
  const { theme, darkMode } = useApp();
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const acc     = section.color;
  const total   = section.quiz.length;
  const answered = Object.keys(answers).length;
  const score   = submitted ? section.quiz.filter((q, i) => answers[i] === q.answer).length : 0;
  const ratio   = total > 0 ? score / total : 0;

  const scoreColor = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";
  const scoreEmoji = ratio >= 0.8 ? "🏆" : ratio >= 0.6 ? "📈" : "💪";
  const scoreLabel = ratio >= 0.8 ? "Excellent !" : ratio >= 0.6 ? "Pas mal !" : "À retravailler";

  if (!total) return (
    <div style={{
      textAlign: "center",
      color: theme.muted,
      padding: "60px 20px",
      background: theme.card,
      borderRadius: 16,
      border: `1px dashed ${theme.border}`,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🧩</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: theme.textSub }}>
        Aucun QCM dans cette section
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        Ajoute une question via <span style={{ color: acc }}>➕ Ajouter</span> en cochant "Ajouter au quiz"
      </div>
    </div>
  );

  return (
    <div>
      {/* Score */}
      {submitted && (
        <div style={{
          marginBottom: 24,
          padding: "20px 24px",
          borderRadius: 16,
          background: scoreColor + "15",
          border: `2px solid ${scoreColor}50`,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{ fontSize: 40 }}>{scoreEmoji}</div>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: scoreColor,
            }}>
              {score} / {total}
            </div>
            <div style={{ color: scoreColor, fontSize: 13, fontWeight: 500 }}>
              {scoreLabel} — {Math.round(ratio * 100)}%
            </div>
          </div>
          {/* Barre de progression */}
          <div style={{ flex: 1, height: 8, background: theme.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${ratio * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
              borderRadius: 4,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}/>
          </div>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {section.quiz.map((q, i) => {
          const sel       = answers[i];
          const isCorrect = submitted && sel === q.answer;
          const isWrong   = submitted && sel !== undefined && sel !== q.answer;

          return (
            <div
              key={i}
              style={{
                background: theme.card,
                borderRadius: 14,
                padding: "18px 18px",
                border: `1.5px solid ${
                  submitted
                    ? isCorrect ? "#22c55e50"
                    : isWrong   ? "#ef444450"
                    : theme.border
                    : theme.border
                }`,
                boxShadow: theme.shadowCard,
              }}
            >
              {/* Question */}
              <div style={{
                display: "flex",
                gap: 10,
                marginBottom: 14,
                alignItems: "flex-start",
              }}>
                <span style={{
                  flexShrink: 0,
                  width: 26, height: 26,
                  borderRadius: 8,
                  background: submitted
                    ? isCorrect ? "#22c55e" : isWrong ? "#ef4444" : theme.border
                    : acc + "30",
                  color: submitted
                    ? "#fff"
                    : acc,
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {submitted ? (isCorrect ? "✓" : isWrong ? "✗" : i+1) : i+1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: theme.text }}>
                  {q.question}
                  {q.custom && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 9,
                      background: acc + "25",
                      color: acc,
                      borderRadius: 4,
                      padding: "2px 6px",
                      verticalAlign: "middle",
                    }}>CUSTOM</span>
                  )}
                </span>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {q.options.map((opt, j) => {
                  let bg = "transparent", bc = theme.border, col = theme.textSub;

                  if (sel === j && !submitted) { bg = acc + "18"; bc = acc; col = theme.text; }
                  if (submitted && j === q.answer) { bg = "#22c55e15"; bc = "#22c55e"; col = "#22c55e"; }
                  if (submitted && sel === j && j !== q.answer) { bg = "#ef444415"; bc = "#ef4444"; col = "#ef4444"; }

                  return (
                    <button
                      key={j}
                      className="opt-btn"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                      style={{
                        padding: "9px 14px",
                        background: bg,
                        border: `1.5px solid ${bc}`,
                        borderRadius: 9,
                        color: col,
                        cursor: submitted ? "default" : "pointer",
                        textAlign: "left",
                        fontSize: 12,
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span style={{
                        width: 20, height: 20,
                        borderRadius: 5,
                        background: bc + "30",
                        color: bc === theme.border ? theme.muted : bc,
                        fontSize: 9,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {["A","B","C","D"][j]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explication */}
              {submitted && (
                <div style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: darkMode ? "#060912" : "#f5efe3",
                  borderRadius: 8,
                  fontSize: 11,
                  color: theme.textSub,
                  lineHeight: 1.7,
                  borderLeft: `3px solid ${acc}`,
                }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton */}
      <button
        onClick={() => {
          if (submitted) { setAnswers({}); setSubmitted(false); }
          else if (answered === total) setSubmitted(true);
        }}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: !submitted && answered < total
            ? theme.border
            : `linear-gradient(135deg, ${acc}, ${acc}cc)`,
          color: !submitted && answered < total
            ? theme.muted
            : (darkMode ? "#000" : "#fff"),
          fontWeight: 700,
          fontSize: 13,
          cursor: submitted || answered === total ? "pointer" : "not-allowed",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: 0.5,
          transition: "all 0.2s",
          boxShadow: submitted || answered === total ? `0 4px 16px ${acc}40` : "none",
        }}
      >
        {submitted
          ? "🔄 Recommencer le quiz"
          : `Valider — ${answered}/${total} réponse${answered > 1 ? "s" : ""}`}
      </button>
    </div>
  );
}