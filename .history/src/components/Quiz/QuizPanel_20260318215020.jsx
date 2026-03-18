// ─────────────────────────────────────────────────────────────
// src/components/Quiz/QuizPanel.jsx
// QCM interactif avec correction et score.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function QuizPanel({ section }) {
  const { theme } = useApp();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = section.quiz.length;
  const answered = Object.keys(answers).length;
  const score = submitted
    ? section.quiz.filter((q, i) => answers[i] === q.answer).length
    : 0;

  const scoreRatio = total > 0 ? score / total : 0;
  const scoreColor =
    scoreRatio >= 0.8 ? "#22c55e" : scoreRatio >= 0.6 ? "#f59e0b" : "#ef4444";

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", color: theme.muted, padding: 40, fontSize: 13 }}>
        Aucune question de quiz pour cette section.<br />
        <span style={{ color: section.color }}>
          Ajoute-en une via l'onglet ➕ Ajouter (coche "Ajouter au quiz").
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Score */}
      {submitted && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 8,
            background: scoreColor + "18",
            border: `1px solid ${scoreColor}`,
            color: scoreColor,
            fontWeight: 600,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {score}/{total} —{" "}
          {scoreRatio >= 0.8 ? "Excellent ✅" : scoreRatio >= 0.6 ? "Correct ⚠️" : "À revoir ❌"}
        </div>
      )}

      {/* Questions */}
      {section.quiz.map((q, i) => {
        const sel = answers[i];
        const isCorrect = submitted && sel === q.answer;
        const isWrong = submitted && sel !== undefined && sel !== q.answer;

        return (
          <div
            key={i}
            style={{
              marginBottom: 16,
              background: theme.card,
              borderRadius: 8,
              padding: 16,
              border: `1px solid ${
                submitted
                  ? isCorrect
                    ? "#22c55e50"
                    : isWrong
                    ? "#ef444450"
                    : theme.border
                  : theme.border
              }`,
            }}
          >
            {/* Question */}
            <div
              style={{
                fontWeight: 500,
                marginBottom: 10,
                color: theme.text,
                fontSize: 13,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <span style={{ color: theme.muted, flexShrink: 0 }}>{i + 1}.</span>
              <span>
                {q.question}
                {q.custom && (
                  <span
                    style={{
                      fontSize: 9,
                      color: section.color,
                      border: `1px solid ${section.color}`,
                      borderRadius: 3,
                      padding: "1px 5px",
                      marginLeft: 8,
                      verticalAlign: "middle",
                    }}
                  >
                    custom
                  </span>
                )}
              </span>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.options.map((opt, j) => {
                let bg = "transparent";
                let bc = theme.border;
                let col = theme.muted;

                if (sel === j && !submitted) {
                  bg = section.color + "20";
                  bc = section.color;
                  col = theme.text;
                }
                if (submitted && j === q.answer) {
                  bg = "#22c55e15";
                  bc = "#22c55e";
                  col = "#22c55e";
                }
                if (submitted && sel === j && j !== q.answer) {
                  bg = "#ef444415";
                  bc = "#ef4444";
                  col = "#ef4444";
                }

                return (
                  <button
                    key={j}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                    style={{
                      padding: "8px 12px",
                      background: bg,
                      border: `1px solid ${bc}`,
                      borderRadius: 6,
                      color: col,
                      cursor: submitted ? "default" : "pointer",
                      textAlign: "left",
                      fontSize: 12,
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {["A", "B", "C", "D"][j]}. {opt}
                  </button>
                );
              })}
            </div>

            {/* Explication */}
            {submitted && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: theme.hover,
                  borderRadius: 6,
                  fontSize: 11,
                  color: theme.muted,
                  lineHeight: 1.6,
                }}
              >
                💡 {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Bouton valider / recommencer */}
      <button
        onClick={submitted ? reset : () => answered === total && setSubmitted(true)}
        style={{
          width: "100%",
          padding: 12,
          border: `1px solid ${section.color}`,
          borderRadius: 8,
          background:
            !submitted && answered < total ? theme.border : section.color + "20",
          color:
            !submitted && answered < total ? theme.muted : section.color,
          cursor: submitted || answered === total ? "pointer" : "not-allowed",
          fontWeight: 600,
          fontSize: 13,
          fontFamily: "inherit",
        }}
      >
        {submitted
          ? "🔄 Recommencer"
          : `Valider (${answered}/${total} répondues)`}
      </button>
    </div>
  );
}