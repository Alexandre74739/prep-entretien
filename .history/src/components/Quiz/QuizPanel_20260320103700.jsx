import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useSRS } from "../../hooks/useSRS";

// Mélange aléatoire (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPanel({ section }) {
  const { theme, darkMode } = useApp();
  const { getCard, review } = useSRS();
  const [mode, setMode] = useState("menu"); // "menu" | "classic" | "reveal" | "adaptive"

  const acc = section.color;

  if (mode === "menu") return (
    <Menu section={section} theme={theme} darkMode={darkMode} onStart={setMode} />
  );
  if (mode === "classic") return (
    <ClassicQuiz section={section} theme={theme} darkMode={darkMode} acc={acc} onBack={() => setMode("menu")} />
  );
  if (mode === "reveal") return (
    <RevealQuiz section={section} theme={theme} darkMode={darkMode} acc={acc} onBack={() => setMode("menu")} />
  );
  if (mode === "adaptive") return (
    <AdaptiveQuiz section={section} theme={theme} darkMode={darkMode} acc={acc} getCard={getCard} review={review} onBack={() => setMode("menu")} />
  );
}

// ══════════════════════════════════════════════════════
// MENU
// ══════════════════════════════════════════════════════
function Menu({ section, theme, darkMode, onStart }) {
  const acc = section.color;
  const hasQcm = section.quiz.length > 0;
  const hasQ   = section.content.length > 0;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: theme.text, marginBottom: 6 }}>
          🧪 Quiz — {section.label}
        </h2>
        <p style={{ fontSize: 12, color: theme.textSub, lineHeight: 1.7 }}>
          Choisis un mode. Les questions sont tirées aléatoirement parmi la section <strong style={{ color: acc }}>{section.label}</strong>.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Quiz classique */}
        <ModeCard
          emoji="🎯"
          color={acc}
          title="Quiz classique"
          lines={[
            "5 questions aléatoires en QCM",
            "Tu réponds, puis tu vois la correction à la fin",
            "Score + feedback + bouton continuer",
          ]}
          badge={`${section.quiz.length} QCM dispo`}
          badgeColor={acc}
          disabled={!hasQcm}
          disabledMsg="Aucun QCM dans cette section — ajoute-en via ➕ Ajouter"
          onClick={() => onStart("classic")}
          theme={theme}
          darkMode={darkMode}
        />

        {/* Révélation immédiate */}
        <ModeCard
          emoji="👁️"
          color="#818cf8"
          title="Révision rapide"
          lines={[
            "Toutes les questions de la section",
            "Clique pour révéler la réponse immédiatement",
            "Parcours à ton rythme, pas de score",
          ]}
          badge={`${section.content.length} questions`}
          badgeColor="#818cf8"
          disabled={!hasQ}
          disabledMsg="Aucune question dans cette section"
          onClick={() => onStart("reveal")}
          theme={theme}
          darkMode={darkMode}
        />

        {/* Quiz adaptatif */}
        <ModeCard
          emoji="🧠"
          color="#f59e0b"
          title="Quiz adaptatif"
          lines={[
            "5 questions choisies selon ton niveau",
            "Priorise celles que tu maîtrises moins bien",
            "Score + feedback + bouton continuer",
          ]}
          badge="Répétition espacée"
          badgeColor="#f59e0b"
          disabled={!hasQcm}
          disabledMsg="Aucun QCM dans cette section — ajoute-en via ➕ Ajouter"
          onClick={() => onStart("adaptive")}
          theme={theme}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function ModeCard({ emoji, color, title, lines, badge, badgeColor, disabled, disabledMsg, onClick, theme, darkMode }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "18px 20px", borderRadius: 14,
        border: `1.5px solid ${disabled ? theme.border : color + "50"}`,
        background: disabled ? theme.card : (darkMode ? color + "0d" : color + "09"),
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left", color: theme.text, fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1, transition: "all 0.18s",
        display: "flex", alignItems: "flex-start", gap: 14,
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`; }}}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: disabled ? theme.muted : color, marginBottom: 6 }}>
          {title}
        </div>
        {disabled ? (
          <div style={{ fontSize: 11, color: theme.muted }}>{disabledMsg}</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 3 }}>
            {lines.map((l, i) => (
              <li key={i} style={{ fontSize: 11, color: theme.textSub, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: color + "80", flexShrink: 0 }}/>
                {l}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span style={{
        flexShrink: 0, padding: "4px 10px", borderRadius: 20,
        background: badgeColor + "20", color: badgeColor,
        fontSize: 10, fontWeight: 700, border: `1px solid ${badgeColor}40`,
        marginTop: 2,
      }}>
        {badge}
      </span>
    </button>
  );
}

// ══════════════════════════════════════════════════════
// QUIZ CLASSIQUE — 5 questions aléatoires, correction à la fin
// ══════════════════════════════════════════════════════
function ClassicQuiz({ section, theme, darkMode, acc, onBack }) {
  const pick5 = () => shuffle(section.quiz).slice(0, 5);
  const [questions, setQuestions] = useState(() => pick5());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio    = score / questions.length;
  const color    = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";

  function continuer() {
    setQuestions(pick5());
    setAnswers({});
    setSubmitted(false);
  }

  if (submitted) return (
    <Feedback
      score={score} total={questions.length} color={color} acc={acc}
      darkMode={darkMode} theme={theme}
      questions={questions} answers={answers}
      onContinue={continuer} onMenu={onBack}
    />
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <QuizHeader title="🎯 Quiz classique" sub={`5 questions aléatoires · ${section.label}`} onBack={onBack} theme={theme} />
      <ProgressDots total={questions.length} answered={answered} acc={acc} theme={theme} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => (
          <QuestionCard
            key={i} index={i} question={q}
            selected={answers[i]} submitted={false}
            onSelect={(j) => setAnswers((a) => ({ ...a, [i]: j }))}
            acc={acc} theme={theme} darkMode={darkMode}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn color={acc} darkMode={darkMode} onClick={() => setSubmitted(true)} disabled={answered < questions.length}>
          Valider · {answered}/{questions.length}
        </Btn>
        <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// RÉVISION RAPIDE — réponse immédiate au clic
// ══════════════════════════════════════════════════════
function RevealQuiz({ section, theme, darkMode, acc, onBack }) {
  const [questions]   = useState(() => shuffle(section.content));
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
    <div style={{ maxWidth: 440, margin: "0 auto", textAlign: "center", background: theme.card, borderRadius: 20, padding: "40px 28px", border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: theme.text, marginBottom: 8 }}>
        Toutes les cartes vues !
      </div>
      <div style={{ fontSize: 12, color: theme.textSub, marginBottom: 24 }}>
        Tu as parcouru <strong style={{ color: acc }}>{questions.length}</strong> question{questions.length > 1 ? "s" : ""}.
      </div>
      <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
    </div>
  );

  const progress = ((cardIndex) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 580 }}>
      <QuizHeader title="👁️ Révision rapide" sub={`${cardIndex + 1}/${questions.length} · ${section.label}`} onBack={onBack} theme={theme} />

      {/* Barre */}
      <div style={{ height: 5, background: theme.border, borderRadius: 3, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, #818cf8, ${acc})`, borderRadius: 3, transition: "width 0.3s" }}/>
      </div>

      {/* Carte */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        style={{
          background: theme.card, borderRadius: 20,
          border: `2px solid ${flipped ? "#818cf8" + "80" : theme.border}`,
          padding: "26px 28px",
          cursor: flipped ? "default" : "pointer",
          minHeight: 180,
          boxShadow: flipped ? "0 0 28px #818cf820" : theme.shadowCard,
          transition: "all 0.25s", position: "relative", userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", top: 14, right: 16, fontSize: 10, color: theme.muted }}>
          {flipped
            ? <span style={{ color: "#818cf8", fontWeight: 600 }}>RÉPONSE</span>
            : <span>clic pour révéler la réponse</span>}
        </div>

        {!flipped ? (
          <div style={{ paddingTop: 20, fontWeight: 600, fontSize: 15, lineHeight: 1.7, color: theme.text }}>
            {card.q}
          </div>
        ) : (
          <div style={{ paddingTop: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#818cf8", marginBottom: 12 }}>{card.q}</div>
            <pre style={{
              whiteSpace: "pre-wrap", fontFamily: "inherit",
              fontSize: 12, lineHeight: 1.9, color: theme.textSub,
              padding: "14px 16px",
              background: darkMode ? "#060912" : "#f5efe3",
              borderRadius: 10, border: `1px solid ${theme.border}`,
            }}>{card.a}</pre>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {flipped && (
          <Btn color="#818cf8" darkMode={darkMode} onClick={next}>
            {cardIndex + 1 >= questions.length ? "Terminer ✓" : "Suivante →"}
          </Btn>
        )}
        <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// QUIZ ADAPTATIF — 5 questions choisies selon le niveau SRS
// ══════════════════════════════════════════════════════
function AdaptiveQuiz({ section, theme, darkMode, acc, getCard, review, onBack }) {
  // Sélectionne 5 questions : priorise les moins bien maîtrisées
  const pick5Adaptive = () => {
    const weighted = section.quiz.map((q, i) => {
      const card = getCard(section.id, i);
      // Plus le score est bas (peu de répétitions, ease faible), plus la priorité est haute
      const priority = (card.repetitions === 0 ? 10 : 0)
        + (3 - Math.min(card.repetitions, 3))
        + (3 - Math.min(card.ease, 3));
      return { q, i, priority };
    });

    // Trie par priorité décroissante puis mélange les ex-aequo
    weighted.sort((a, b) => b.priority - a.priority || Math.random() - 0.5);
    return weighted.slice(0, 5).map((w) => ({ ...w.q, _idx: w.i }));
  };

  const [questions, setQuestions] = useState(() => pick5Adaptive());
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const ratio    = score / questions.length;
  const color    = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";

  function continuer() {
    // Enregistre les résultats SRS avant de passer aux suivantes
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
      score={score} total={questions.length} color={color} acc="#f59e0b"
      darkMode={darkMode} theme={theme}
      questions={questions} answers={answers}
      onContinue={continuer} onMenu={onBack}
      adaptiveMsg="Les résultats sont pris en compte pour adapter les prochaines questions."
    />
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <QuizHeader title="🧠 Quiz adaptatif" sub={`5 questions selon ton niveau · ${section.label}`} onBack={onBack} theme={theme} />
      <ProgressDots total={questions.length} answered={answered} acc="#f59e0b" theme={theme} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {questions.map((q, i) => (
          <QuestionCard
            key={i} index={i} question={q}
            selected={answers[i]} submitted={false}
            onSelect={(j) => setAnswers((a) => ({ ...a, [i]: j }))}
            acc="#f59e0b" theme={theme} darkMode={darkMode}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn color="#f59e0b" darkMode={darkMode} onClick={() => setSubmitted(true)} disabled={answered < questions.length}>
          Valider · {answered}/{questions.length}
        </Btn>
        <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// FEEDBACK FINAL (partagé entre classique et adaptatif)
// ══════════════════════════════════════════════════════
function Feedback({ score, total, color, acc, darkMode, theme, questions, answers, onContinue, onMenu, adaptiveMsg }) {
  const ratio = score / total;
  const emoji = ratio >= 0.8 ? "🏆" : ratio >= 0.6 ? "📈" : "💪";
  const msg   = ratio >= 0.8 ? "Excellent ! Tu maîtrises bien ce sujet."
              : ratio >= 0.6 ? "Pas mal ! Relis les réponses en rouge."
              : "Continue à t'entraîner, ça viendra !";

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Score */}
      <div style={{
        padding: "22px 24px", borderRadius: 16,
        background: color + "12", border: `2px solid ${color}50`,
        marginBottom: 22, display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: 40 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color }}>
            {score} / {total}
          </div>
          <div style={{ fontSize: 12, color: theme.textSub, marginTop: 3 }}>{msg}</div>
          {adaptiveMsg && <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>🧠 {adaptiveMsg}</div>}
        </div>
        {/* Jauge */}
        <div style={{ width: 56, height: 56, position: "relative", flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 56, height: 56 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke={theme.border} strokeWidth="3"/>
            <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${ratio * 94} 94`} strokeLinecap="round"/>
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color }}>
            {Math.round(ratio * 100)}%
          </span>
        </div>
      </div>

      {/* Correction détaillée */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {questions.map((q, i) => {
          const sel = answers[i];
          const ok  = sel === q.answer;
          const c   = ok ? "#22c55e" : "#ef4444";
          return (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: c + "0c", border: `1.5px solid ${c}40` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
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
                borderRadius: 8, borderLeft: `3px solid ${acc}`,
              }}>
                💡 {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Boutons */}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn color={acc} darkMode={darkMode} onClick={onContinue}>▶ Continuer</Btn>
        <BtnOutline theme={theme} onClick={onMenu}>← Menu</BtnOutline>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Composants partagés
// ══════════════════════════════════════════════════════

function QuizHeader({ title, sub, onBack, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "5px 12px", color: theme.textSub, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
        ← Menu
      </button>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: theme.text }}>{title}</div>
        <div style={{ fontSize: 10, color: theme.muted, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function ProgressDots({ total, answered, acc, theme }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 5, borderRadius: 3,
          background: i < answered ? acc : theme.border,
          transition: "background 0.2s",
        }}/>
      ))}
    </div>
  );
}

function QuestionCard({ index, question, selected, onSelect, acc, theme, darkMode }) {
  return (
    <div style={{ background: theme.card, borderRadius: 14, padding: "16px 18px", border: `1.5px solid ${selected !== undefined ? acc + "60" : theme.border}`, boxShadow: theme.shadowCard }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
        <span style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: 7,
          background: selected !== undefined ? acc : theme.border,
          color: selected !== undefined ? (darkMode ? "#000" : "#fff") : theme.muted,
          fontSize: 10, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}>{index + 1}</span>
        <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: theme.text }}>{question.question}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {question.options.map((opt, j) => (
          <button key={j} className="opt-btn"
            onClick={() => onSelect(j)}
            style={{
              padding: "9px 14px",
              background: selected === j ? acc + "20" : "transparent",
              border: `1.5px solid ${selected === j ? acc : theme.border}`,
              borderRadius: 9, color: selected === j ? acc : theme.textSub,
              cursor: "pointer", textAlign: "left", fontSize: 12,
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span style={{
              width: 20, height: 20, borderRadius: 5,
              background: (selected === j ? acc : theme.border) + "40",
              color: selected === j ? acc : theme.muted,
              fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>{["A","B","C","D"][j]}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Btn({ color, darkMode, onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: "12px 22px", borderRadius: 10, border: "none",
        background: disabled ? "#2a2d3a" : `linear-gradient(135deg, ${color}, ${color}bb)`,
        color: disabled ? "#4a5a72" : (darkMode ? "#000" : "#fff"),
        fontWeight: 700, fontSize: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        boxShadow: disabled ? "none" : `0 4px 14px ${color}40`,
        transition: "all 0.18s",
      }}
    >{children}</button>
  );
}

function BtnOutline({ theme, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "12px 18px", borderRadius: 10,
        border: `1.5px solid ${theme.border}`,
        background: "transparent", color: theme.textSub,
        fontWeight: 500, fontSize: 12,
        cursor: "pointer", fontFamily: "inherit",
      }}
    >{children}</button>
  );
}