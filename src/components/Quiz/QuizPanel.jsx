import { useState } from "react";
import { useSRS } from "../../hooks/useSRS";
import { IconTarget, IconEye, IconZap, IconTrophy, IconCheck } from "../ui/Icon";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPanel({ section }) {
  const { getCard, review } = useSRS();
  const [mode, setMode] = useState("menu");

  if (mode === "menu")     return <Menu section={section} onStart={setMode} />;
  if (mode === "classic")  return <ClassicQuiz  section={section} onBack={() => setMode("menu")} />;
  if (mode === "reveal")   return <RevealQuiz   section={section} onBack={() => setMode("menu")} />;
  if (mode === "adaptive") return <AdaptiveQuiz section={section} getCard={getCard} review={review} onBack={() => setMode("menu")} />;
}

// ── Menu ──────────────────────────────────────────────────────
function Menu({ section, onStart }) {
  const modes = [
    {
      id: "classic",
      icon: <IconTarget />,
      title: "Quiz classique",
      lines: ["5 questions aléatoires en QCM", "Tu réponds, puis tu vois la correction à la fin", "Score + feedback + bouton continuer"],
      badge: `${section.quiz.length} QCM dispo`,
      disabled: section.quiz.length === 0,
      disabledMsg: "Aucun QCM dans cette section — ajoute-en via ＋ Ajouter",
    },
    {
      id: "reveal",
      icon: <IconEye />,
      title: "Révision rapide",
      lines: ["Toutes les questions de la section", "Clique pour révéler la réponse immédiatement", "Parcours à ton rythme, pas de score"],
      badge: `${section.content.length} questions`,
      disabled: section.content.length === 0,
      disabledMsg: "Aucune question dans cette section",
    },
    {
      id: "adaptive",
      icon: <IconZap />,
      title: "Quiz adaptatif",
      lines: ["5 questions choisies selon ton niveau", "Priorise celles que tu maîtrises moins bien", "Score + feedback + répétition espacée"],
      badge: "Répétition espacée",
      disabled: section.quiz.length === 0,
      disabledMsg: "Aucun QCM dans cette section — ajoute-en via ＋ Ajouter",
    },
  ];

  return (
    <div className="quiz-panel">
      <div className="quiz-intro">
        <h2 className="quiz-intro__title">Quiz — {section.label}</h2>
        <p className="quiz-intro__desc">
          Choisis un mode. Les questions sont tirées parmi{" "}
          <strong>{section.label}</strong>.
        </p>
      </div>

      <div className="mode-cards">
        {modes.map((m) => (
          <button
            key={m.id}
            className="mode-card"
            disabled={m.disabled}
            onClick={m.disabled ? undefined : () => onStart(m.id)}
          >
            <span className="mode-card__icon-wrap">{m.icon}</span>
            <div className="mode-card__info">
              <div className="mode-card__title">{m.title}</div>
              {m.disabled ? (
                <div className="mode-card__disabled-msg">{m.disabledMsg}</div>
              ) : (
                <ul className="mode-card__lines">
                  {m.lines.map((l, i) => (
                    <li key={i} className="mode-card__line">
                      <span className="mode-card__dot" />
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="mode-card__badge">{m.badge}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Classic Quiz ──────────────────────────────────────────────
function ClassicQuiz({ section, onBack }) {
  const pick5 = () => shuffle(section.quiz).slice(0, 5);
  const [questions, setQuestions] = useState(() => pick5());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio    = score / questions.length;
  const hexColor = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";

  function continuer() {
    setQuestions(pick5());
    setAnswers({});
    setSubmitted(false);
  }

  if (submitted) return (
    <Feedback
      score={score} total={questions.length}
      hexColor={hexColor}
      questions={questions} answers={answers}
      onContinue={continuer} onMenu={onBack}
    />
  );

  return (
    <div className="quiz-panel">
      <QuizHeader title="Quiz classique" sub={`5 questions aléatoires · ${section.label}`} onBack={onBack} />
      <ProgressDots total={questions.length} answered={answered} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => (
          <QuestionCard
            key={i} index={i} question={q}
            selected={answers[i]}
            onSelect={(j) => setAnswers((a) => ({ ...a, [i]: j }))}
          />
        ))}
      </div>

      <div className="quiz-actions">
        <button
          className="btn btn--primary"
          onClick={() => setSubmitted(true)}
          disabled={answered < questions.length}
        >
          Valider · {answered}/{questions.length}
        </button>
        <button className="btn btn--outline btn--back" onClick={onBack}>← Menu</button>
      </div>
    </div>
  );
}

// ── Révision rapide ───────────────────────────────────────────
function RevealQuiz({ section, onBack }) {
  const [questions]  = useState(() => shuffle(section.content));
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [done, setDone]           = useState(false);

  const card = questions[cardIndex];

  function next() {
    setFlipped(false);
    if (cardIndex + 1 >= questions.length) setDone(true);
    else setCardIndex((i) => i + 1);
  }

  if (done) return (
    <div className="quiz-panel">
      <div className="reveal-done">
        <div className="reveal-done__icon"><IconCheck /></div>
        <div className="reveal-done__title">Toutes les cartes vues !</div>
        <p className="reveal-done__desc">
          Tu as parcouru <strong>{questions.length}</strong> question{questions.length > 1 ? "s" : ""}.
        </p>
        <button className="btn btn--outline" onClick={onBack}>← Menu</button>
      </div>
    </div>
  );

  const progress = (cardIndex / questions.length) * 100;

  return (
    <div className="quiz-panel">
      <QuizHeader title="Révision rapide" sub={`${cardIndex + 1}/${questions.length} · ${section.label}`} onBack={onBack} />

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      <div
        className={`reveal-card${flipped ? " is-flipped" : ""}`}
        onClick={() => !flipped && setFlipped(true)}
      >
        <div className={`reveal-card__status${flipped ? " is-answer" : ""}`}>
          {flipped ? "RÉPONSE" : "clic pour révéler"}
        </div>

        {!flipped ? (
          <div className="reveal-card__question">{card.q}</div>
        ) : (
          <>
            <div className="reveal-card__answer-q">{card.q}</div>
            <pre className="reveal-card__answer-text">{card.a}</pre>
          </>
        )}
      </div>

      <div className="quiz-actions">
        {flipped && (
          <button className="btn btn--primary" onClick={next}>
            {cardIndex + 1 >= questions.length ? "Terminer ✓" : "Suivante →"}
          </button>
        )}
        <button className="btn btn--outline" onClick={onBack}>← Menu</button>
      </div>
    </div>
  );
}

// ── Quiz adaptatif ────────────────────────────────────────────
function AdaptiveQuiz({ section, getCard, review, onBack }) {
  const pick5Adaptive = () => {
    const weighted = section.quiz.map((q, i) => {
      const card = getCard(section.id, i);
      const priority = (card.repetitions === 0 ? 10 : 0)
        + (3 - Math.min(card.repetitions, 3))
        + (3 - Math.min(card.ease, 3));
      return { q, i, priority };
    });
    weighted.sort((a, b) => b.priority - a.priority || Math.random() - 0.5);
    return weighted.slice(0, 5).map((w) => ({ ...w.q, _idx: w.i }));
  };

  const [questions, setQuestions] = useState(() => pick5Adaptive());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio    = score / questions.length;
  const hexColor = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";

  function continuer() {
    questions.forEach((q, i) => {
      const rating = answers[i] === q.answer ? (score / questions.length >= 0.8 ? 3 : 2) : 1;
      review(section.id, q._idx ?? i, rating);
    });
    setQuestions(pick5Adaptive());
    setAnswers({});
    setSubmitted(false);
  }

  if (submitted) return (
    <Feedback
      score={score} total={questions.length}
      hexColor={hexColor}
      questions={questions} answers={answers}
      onContinue={continuer} onMenu={onBack}
      adaptiveMsg="Les résultats adaptent les prochaines questions."
    />
  );

  return (
    <div className="quiz-panel">
      <QuizHeader title="Quiz adaptatif" sub={`5 questions selon ton niveau · ${section.label}`} onBack={onBack} />
      <ProgressDots total={questions.length} answered={answered} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => (
          <QuestionCard
            key={i} index={i} question={q}
            selected={answers[i]}
            onSelect={(j) => setAnswers((a) => ({ ...a, [i]: j }))}
          />
        ))}
      </div>

      <div className="quiz-actions">
        <button
          className="btn btn--primary"
          onClick={() => setSubmitted(true)}
          disabled={answered < questions.length}
        >
          Valider · {answered}/{questions.length}
        </button>
        <button className="btn btn--outline" onClick={onBack}>← Menu</button>
      </div>
    </div>
  );
}

// ── Feedback ──────────────────────────────────────────────────
function Feedback({ score, total, hexColor, questions, answers, onContinue, onMenu, adaptiveMsg }) {
  const ratio = score / total;
  const icon  = ratio >= 0.8 ? <IconTrophy /> : <IconCheck />;
  const msg   = ratio >= 0.8 ? "Excellent ! Tu maîtrises bien ce sujet."
              : ratio >= 0.6 ? "Pas mal ! Relis les réponses en rouge."
              : "Continue à t'entraîner, ça viendra !";

  return (
    <div className="quiz-panel">
      <div className="feedback-score" style={{ "--score-color": hexColor, color: hexColor }}>
        <span className="feedback-score__icon">{icon}</span>
        <div className="feedback-score__info">
          <div className="feedback-score__value">{score} / {total}</div>
          <div className="feedback-score__msg">{msg}</div>
          {adaptiveMsg && <div className="feedback-score__note">{adaptiveMsg}</div>}
        </div>
        <div className="gauge" style={{ width: 56, height: 56 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 56, height: 56 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke={hexColor} strokeWidth="3"
              strokeDasharray={`${ratio * 94} 94`} strokeLinecap="round" />
          </svg>
          <span className="gauge__label" style={{ color: hexColor, fontSize: 11 }}>
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
              <div className="feedback-item__explanation">
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button className="btn btn--primary" onClick={onContinue}>▶ Continuer</button>
        <button className="btn btn--outline" onClick={onMenu}>← Menu</button>
      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────
function QuizHeader({ title, sub, onBack }) {
  return (
    <div className="quiz-header">
      <button className="btn--back" onClick={onBack}>← Menu</button>
      <div className="quiz-header__info">
        <div className="quiz-header__title">{title}</div>
        <div className="quiz-header__sub">{sub}</div>
      </div>
    </div>
  );
}

function ProgressDots({ total, answered }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`progress-dots__dot${i < answered ? " is-done" : ""}`} />
      ))}
    </div>
  );
}

function QuestionCard({ index, question, selected, onSelect }) {
  return (
    <div className={`question-card${selected !== undefined ? " has-answer" : ""}`}>
      <div className="question-card__header">
        <span className={`question-card__num${selected !== undefined ? " has-answer" : ""}`}>
          {index + 1}
        </span>
        <span className="question-card__text">{question.question}</span>
      </div>
      <div className="quiz-options">
        {question.options.map((opt, j) => (
          <button
            key={j}
            className={`quiz-option${selected === j ? " is-selected" : ""}`}
            onClick={() => onSelect(j)}
          >
            <span className="quiz-option__letter">{["A","B","C","D"][j]}</span>
            <span className="quiz-option__text">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
