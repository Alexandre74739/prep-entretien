import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { IconMic, IconTrophy, IconCheck } from "../ui/Icon";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function InterviewQuiz() {
  const { sections } = useApp();

  const allQcm = sections.flatMap((s) =>
    s.quiz.map((q) => ({ ...q, sectionLabel: s.label, sectionIcon: s.icon }))
  );

  const pick10 = () => shuffle(allQcm).slice(0, Math.min(10, allQcm.length));

  const [questions, setQuestions] = useState(() => pick10());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted]     = useState(false);

  const answered = Object.keys(answers).length;
  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio    = questions.length > 0 ? score / questions.length : 0;
  const hexColor = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";
  const msg      = ratio >= 0.8 ? "Excellent ! Tu es prêt(e) pour l'entretien."
                 : ratio >= 0.6 ? "Bonne base ! Relis les points en rouge."
                 : "Continue à t'entraîner, tu vas y arriver !";

  function continuer() {
    setQuestions(pick10());
    setAnswers({});
    setSubmitted(false);
  }

  // ── Accueil ────────────────────────────────────────────────
  if (!started) return (
    <div className="quiz-panel">
      <div className="interview-hero">
        <div className="interview-hero__icon"><IconMic /></div>
        <h2 className="interview-hero__title">Quiz Entretien</h2>
        <p className="interview-hero__desc">
          Simule un vrai entretien technique.{" "}
          <strong>10 questions</strong> tirées aléatoirement parmi{" "}
          <strong>toutes les sections</strong> — HTML, CSS, JS, React, SQL, Git, Docker…
          <br />Tu réponds à tout, puis tu vois la correction complète.
        </p>

        <div className="interview-hero__stats">
          {[
            { label: "Questions", value: Math.min(10, allQcm.length) },
            { label: "Sections",  value: sections.filter((s) => s.quiz.length > 0).length },
            { label: "QCM dispo", value: allQcm.length },
          ].map(({ label, value }) => (
            <div key={label} className="stat-badge">
              <span className="stat-badge__value">{value}</span>
              <span className="stat-badge__label">{label}</span>
            </div>
          ))}
        </div>

        <div className="interview-hero__sections-label">Sections incluses</div>
        <div className="interview-hero__sections">
          {sections.filter((s) => s.quiz.length > 0).map((s) => (
            <span key={s.id} className="badge badge--custom">
              <i className={s.icon} />
              {s.label} · {s.quiz.length}
            </span>
          ))}
        </div>

        {allQcm.length === 0 ? (
          <div className="interview-hero__empty-msg">
            Aucun QCM disponible. Ajoute des questions via{" "}
            <span>＋ Ajouter</span> en cochant "Ajouter au quiz".
          </div>
        ) : (
          <button className="interview-hero__start-btn" onClick={() => setStarted(true)}>
            Commencer le quiz →
          </button>
        )}
      </div>
    </div>
  );

  // ── Feedback ───────────────────────────────────────────────
  if (submitted) return (
    <div className="quiz-panel">
      <div className="feedback-score" style={{ "--score-color": hexColor, color: hexColor }}>
        <span className="feedback-score__icon">
          {ratio >= 0.8 ? <IconTrophy /> : <IconCheck />}
        </span>
        <div className="feedback-score__info">
          <div className="feedback-score__value">{score} / {questions.length}</div>
          <div className="feedback-score__msg">{msg}</div>
        </div>
        <div className="gauge" style={{ width: 60, height: 60 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 60, height: 60 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke={hexColor} strokeWidth="3"
              strokeDasharray={`${ratio * 94} 94`} strokeLinecap="round" />
          </svg>
          <span className="gauge__label" style={{ color: hexColor, fontSize: 12 }}>
            {Math.round(ratio * 100)}%
          </span>
        </div>
      </div>

      <div className="feedback-items">
        {questions.map((q, i) => {
          const sel = answers[i];
          const ok  = sel === q.answer;
          return (
            <div key={i} className={`feedback-item feedback-item--${ok ? "ok" : "wrong"}`}>
              <div className="feedback-item__section-badge">
                <i className={q.sectionIcon} />
                {q.sectionLabel}
              </div>

              <div className="feedback-item__header">
                <span className="feedback-item__icon">{ok ? "✓" : "✗"}</span>
                <span className="feedback-item__question">{q.question}</span>
              </div>

              {!ok && (
                <div className="feedback-item__wrong-answer">
                  Ta réponse : <span className="wrong">{q.options[sel] ?? "—"}</span>
                  {" · "}Bonne réponse : <span className="correct">{q.options[q.answer]}</span>
                </div>
              )}

              <div className="feedback-item__explanation">{q.explanation}</div>
            </div>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button className="btn btn--primary" onClick={continuer}>Continuer →</button>
        <button className="btn btn--outline" onClick={() => { setStarted(false); setAnswers({}); setSubmitted(false); }}>
          ← Menu
        </button>
      </div>
    </div>
  );

  // ── Questions ──────────────────────────────────────────────
  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <button className="btn--back" onClick={() => setStarted(false)}>← Menu</button>
        <div className="quiz-header__info">
          <div className="quiz-header__title">Quiz Entretien</div>
          <div className="quiz-header__sub">Toutes sections · {questions.length} questions</div>
        </div>
      </div>

      <div className="progress-dots">
        {questions.map((_, i) => (
          <div key={i} className={`progress-dots__dot${i < answered ? " is-done" : ""}`} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => {
          const sel = answers[i];
          return (
            <div key={i} className={`question-card${sel !== undefined ? " has-answer" : ""}`}>
              <span className="question-card__section-badge">
                <i className={q.sectionIcon} />
                {q.sectionLabel}
              </span>

              <div className="question-card__header">
                <span className={`question-card__num${sel !== undefined ? " has-answer" : ""}`}>{i + 1}</span>
                <span className="question-card__text">{q.question}</span>
              </div>

              <div className="quiz-options">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    className={`quiz-option${sel === j ? " is-selected" : ""}`}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  >
                    <span className="quiz-option__letter">{["A","B","C","D"][j]}</span>
                    <span className="quiz-option__text">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button
          className="btn btn--primary"
          disabled={answered < questions.length}
          onClick={() => answered === questions.length && setSubmitted(true)}
        >
          Valider · {answered}/{questions.length}
        </button>
        <button className="btn btn--outline" onClick={() => setStarted(false)}>← Menu</button>
      </div>
    </div>
  );
}
