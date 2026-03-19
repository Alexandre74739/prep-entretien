// ─────────────────────────────────────────────────────────────
// src/components/Quiz/QuizPanel.jsx
//
// Quiz en blocs de 5 questions max avec feedback entre blocs.
// Deux modes accessibles depuis un menu :
//   - "qcm"     : questions à choix multiples classiques
//   - "flashcard" : répétition espacée (SRS) - flip de cartes
// ─────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useSRS } from "../../hooks/useSRS";

const BLOCK_SIZE = 5;

export default function QuizPanel({ section }) {
  const { theme, darkMode } = useApp();
  const { getCard, review, isDue, resetSRS } = useSRS();

  // "menu" | "qcm" | "flashcard"
  const [mode, setMode] = useState("menu");
  const [flashSub, setFlashSub] = useState("due"); // "due" | "all"

  function startMode(m, sub) {
    setMode(m);
    if (sub) setFlashSub(sub);
  }

  if (mode === "menu") {
    return (
      <Menu
        section={section}
        theme={theme}
        darkMode={darkMode}
        isDue={isDue}
        onStart={startMode}
      />
    );
  }

  if (mode === "qcm") {
    return (
      <QCMMode
        section={section}
        theme={theme}
        darkMode={darkMode}
        onBack={() => setMode("menu")}
      />
    );
  }

  if (mode === "flashcard") {
    return (
      <FlashcardMode
        section={section}
        theme={theme}
        darkMode={darkMode}
        sub={flashSub}
        getCard={getCard}
        review={review}
        isDue={isDue}
        onBack={() => setMode("menu")}
      />
    );
  }
}

// ════════════════════════════════════════════════════════
// MENU
// ════════════════════════════════════════════════════════
function Menu({ section, theme, darkMode, isDue, onStart }) {
  const dueCount = section.content.filter((_, i) => isDue(section.id, i)).length;
  const acc = section.color;

  if (section.quiz.length === 0 && section.content.length === 0) {
    return (
      <Empty theme={theme} acc={acc} />
    );
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 20,
          color: theme.text, marginBottom: 6,
        }}>
          🧪 Quiz — {section.label}
        </h2>
        <p style={{ fontSize: 12, color: theme.textSub, lineHeight: 1.7 }}>
          Choisis un mode pour t'entraîner. Les blocs QCM font 5 questions max avec un feedback entre chaque bloc.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* QCM */}
        <ModeCard
          emoji="🎯"
          title="QCM classique"
          description={`${section.quiz.length} question${section.quiz.length > 1 ? "s" : ""} · blocs de ${BLOCK_SIZE} max · correction immédiate`}
          badge={`${section.quiz.length} QCM`}
          badgeColor={acc}
          disabled={section.quiz.length === 0}
          disabledMsg="Aucun QCM dans cette section — ajoute-en via ➕ Ajouter"
          onClick={() => onStart("qcm")}
          theme={theme}
          darkMode={darkMode}
          color={acc}
        />

        {/* Flashcard — dues */}
        <ModeCard
          emoji="⏰"
          title="Répétition espacée — À revoir"
          description="Uniquement les cartes dues aujourd'hui. Note ta réponse pour planifier la prochaine révision."
          badge={`${dueCount} due${dueCount > 1 ? "s" : ""}`}
          badgeColor="#f59e0b"
          disabled={section.content.length === 0}
          disabledMsg="Aucune question dans cette section"
          onClick={() => onStart("flashcard", "due")}
          theme={theme}
          darkMode={darkMode}
          color="#f59e0b"
        />

        {/* Flashcard — toutes */}
        <ModeCard
          emoji="📚"
          title="Toutes les questions"
          description="Parcours toutes les cartes en mode flashcard, peu importe leur date de révision."
          badge={`${section.content.length} cartes`}
          badgeColor="#818cf8"
          disabled={section.content.length === 0}
          disabledMsg="Aucune question dans cette section"
          onClick={() => onStart("flashcard", "all")}
          theme={theme}
          darkMode={darkMode}
          color="#818cf8"
        />
      </div>
    </div>
  );
}

function ModeCard({ emoji, title, description, badge, badgeColor, disabled, disabledMsg, onClick, theme, darkMode, color }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "18px 20px",
        borderRadius: 14,
        border: `1.5px solid ${disabled ? theme.border : color + "50"}`,
        background: disabled ? theme.card : (darkMode ? color + "0e" : color + "0a"),
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        color: theme.text,
        fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.18s",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: 14,
          color: disabled ? theme.muted : color,
          marginBottom: 4,
        }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: theme.textSub, lineHeight: 1.6 }}>
          {disabled ? disabledMsg : description}
        </div>
      </div>
      <span style={{
        flexShrink: 0,
        padding: "4px 10px", borderRadius: 20,
        background: badgeColor + "20",
        color: badgeColor,
        fontSize: 11, fontWeight: 700,
        border: `1px solid ${badgeColor}40`,
      }}>
        {badge}
      </span>
    </button>
  );
}

// ════════════════════════════════════════════════════════
// MODE QCM — blocs de 5 avec feedback
// ════════════════════════════════════════════════════════
function QCMMode({ section, theme, darkMode, onBack }) {
  const acc = section.color;

  // Découpe les questions en blocs de BLOCK_SIZE
  const blocks = useMemo(() => {
    const all = [...section.quiz];
    const result = [];
    for (let i = 0; i < all.length; i += BLOCK_SIZE) {
      result.push(all.slice(i, i + BLOCK_SIZE));
    }
    return result;
  }, [section.quiz]);

  const [blockIndex, setBlockIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false); // feedback du bloc
  const [allDone, setAllDone] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const block = blocks[blockIndex] ?? [];
  const answered = Object.keys(answers).length;
  const blockScore = block.filter((q, i) => answers[i] === q.answer).length;
  const isLastBlock = blockIndex === blocks.length - 1;

  function submitBlock() {
    if (answered < block.length) return;
    setSubmitted(true);
    setTotalScore((s) => s + blockScore);
    setTotalAnswered((t) => t + block.length);
  }

  function nextBlock() {
    if (isLastBlock) {
      setAllDone(true);
    } else {
      setBlockIndex((i) => i + 1);
      setAnswers({});
      setSubmitted(false);
    }
  }

  function restart() {
    setBlockIndex(0);
    setAnswers({});
    setSubmitted(false);
    setAllDone(false);
    setTotalScore(0);
    setTotalAnswered(0);
  }

  // Résultat final
  if (allDone) {
    const ratio = totalAnswered > 0 ? totalScore / totalAnswered : 0;
    const color = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";
    const emoji = ratio >= 0.8 ? "🏆" : ratio >= 0.6 ? "📈" : "💪";
    return (
      <div style={{
        maxWidth: 480, margin: "0 auto",
        textAlign: "center",
        background: theme.card,
        borderRadius: 20,
        padding: "40px 32px",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>{emoji}</div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 22,
          color: theme.text, marginBottom: 8,
        }}>
          Quiz terminé !
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 36,
          color, marginBottom: 6,
        }}>
          {totalScore} / {totalAnswered}
        </div>
        <div style={{ fontSize: 13, color: theme.textSub, marginBottom: 8 }}>
          {Math.round(ratio * 100)}% de bonnes réponses
        </div>
        {/* Barre */}
        <div style={{ height: 8, background: theme.border, borderRadius: 4, overflow: "hidden", marginBottom: 28 }}>
          <div style={{
            width: `${ratio * 100}%`, height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: 4,
          }} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn color={acc} darkMode={darkMode} onClick={restart}>🔄 Recommencer</Btn>
          <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
        </div>
      </div>
    );
  }

  // Feedback entre blocs
  if (submitted) {
    const ratio = blockScore / block.length;
    const color = ratio >= 0.8 ? "#22c55e" : ratio >= 0.6 ? "#f59e0b" : "#ef4444";
    const emoji = ratio >= 0.8 ? "🎉" : ratio >= 0.6 ? "👍" : "💡";
    return (
      <div style={{ maxWidth: 560 }}>
        {/* En-tête feedback */}
        <div style={{
          padding: "20px 24px",
          borderRadius: 16,
          background: color + "12",
          border: `2px solid ${color}50`,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 36 }}>{emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: 18, color,
            }}>
              Bloc {blockIndex + 1} / {blocks.length} — {blockScore}/{block.length}
            </div>
            <div style={{ fontSize: 12, color: theme.textSub, marginTop: 4 }}>
              {ratio >= 0.8 ? "Excellent ! Continue comme ça." : ratio >= 0.6 ? "Pas mal, relis les explications en rouge." : "Relis bien les explications avant de continuer."}
            </div>
          </div>
          <div style={{ height: 48, width: 48, position: "relative" }}>
            <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 48, height: 48 }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke={theme.border} strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={color} strokeWidth="3"
                strokeDasharray={`${ratio * 94} 94`}
                strokeLinecap="round"
              />
            </svg>
            <span style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color,
            }}>
              {Math.round(ratio * 100)}%
            </span>
          </div>
        </div>

        {/* Correction détaillée */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {block.map((q, i) => {
            const sel = answers[i];
            const ok = sel === q.answer;
            const c = ok ? "#22c55e" : "#ef4444";
            return (
              <div key={i} style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: c + "0c",
                border: `1.5px solid ${c}40`,
              }}>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  marginBottom: 8,
                }}>
                  <span style={{
                    width: 22, height: 22,
                    borderRadius: 6,
                    background: c,
                    color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {ok ? "✓" : "✗"}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: theme.text, lineHeight: 1.5 }}>
                    {q.question}
                  </span>
                </div>
                {!ok && (
                  <div style={{ fontSize: 11, color: theme.textSub, marginLeft: 32, marginBottom: 6 }}>
                    Ta réponse : <span style={{ color: "#ef4444" }}>{q.options[sel] ?? "—"}</span>
                    {" · "}
                    Bonne réponse : <span style={{ color: "#22c55e" }}>{q.options[q.answer]}</span>
                  </div>
                )}
                <div style={{
                  fontSize: 11, color: theme.textSub,
                  marginLeft: 32, lineHeight: 1.6,
                  padding: "8px 12px",
                  background: darkMode ? "#060912" : "#f5efe3",
                  borderRadius: 8,
                  borderLeft: `3px solid ${acc}`,
                }}>
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn color={acc} darkMode={darkMode} onClick={nextBlock}>
            {isLastBlock ? "🏁 Voir le résultat final" : `Bloc suivant →`}
          </Btn>
          <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
        </div>
      </div>
    );
  }

  // Questions du bloc courant
  return (
    <div style={{ maxWidth: 560 }}>
      {/* Progression globale */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: theme.muted }}>
            Bloc {blockIndex + 1} / {blocks.length}
          </span>
          <span style={{ fontSize: 11, color: theme.muted }}>
            {answered}/{block.length} réponses
          </span>
        </div>
        <div style={{ height: 5, background: theme.border, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${(blockIndex / blocks.length) * 100 + (answered / block.length) * (100 / blocks.length)}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${acc}, #818cf8)`,
            borderRadius: 3,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {block.map((q, i) => {
          const sel = answers[i];
          return (
            <div key={i} style={{
              background: theme.card,
              borderRadius: 14,
              padding: "16px 18px",
              border: `1.5px solid ${sel !== undefined ? acc + "60" : theme.border}`,
              boxShadow: theme.shadowCard,
            }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0,
                  width: 24, height: 24, borderRadius: 7,
                  background: sel !== undefined ? acc : theme.border,
                  color: sel !== undefined ? (darkMode ? "#000" : "#fff") : theme.muted,
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: theme.text }}>
                  {q.question}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    className="opt-btn"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                    style={{
                      padding: "9px 14px",
                      background: sel === j ? acc + "20" : "transparent",
                      border: `1.5px solid ${sel === j ? acc : theme.border}`,
                      borderRadius: 9,
                      color: sel === j ? acc : theme.textSub,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 12,
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 5,
                      background: (sel === j ? acc : theme.border) + "40",
                      color: sel === j ? acc : theme.muted,
                      fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {["A", "B", "C", "D"][j]}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn
          color={acc}
          darkMode={darkMode}
          onClick={submitBlock}
          disabled={answered < block.length}
        >
          Valider le bloc · {answered}/{block.length}
        </Btn>
        <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MODE FLASHCARD (SRS)
// ════════════════════════════════════════════════════════
function FlashcardMode({ section, theme, darkMode, sub, getCard, review, isDue, onBack }) {
  const acc = section.color;

  const cards = useMemo(() => {
    return section.content
      .map((q, i) => ({ ...q, questionIndex: i }))
      .filter((q) => sub === "all" || isDue(section.id, q.questionIndex));
  }, [section, sub]);

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const card = cards[cardIndex];
  const cardData = card ? getCard(section.id, card.questionIndex) : null;
  const progress = cards.length > 0 ? (cardIndex / cards.length) * 100 : 0;

  function handleRate(rating) {
    if (!card) return;
    review(section.id, card.questionIndex, rating);
    next();
  }

  function next() {
    setFlipped(false);
    if (cardIndex + 1 >= cards.length) setFinished(true);
    else setCardIndex((i) => i + 1);
  }

  function restart() {
    setCardIndex(0);
    setFlipped(false);
    setFinished(false);
  }

  if (cards.length === 0) return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: theme.text, marginBottom: 8 }}>
        {sub === "due" ? "Rien à revoir !" : "Aucune question"}
      </div>
      <div style={{ fontSize: 12, color: theme.textSub, marginBottom: 24 }}>
        {sub === "due" ? "Toutes tes cartes sont à jour. Reviens demain 🌟" : "Ajoute des questions via ➕ Ajouter."}
      </div>
      <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
    </div>
  );

  if (finished) return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", background: theme.card, borderRadius: 20, padding: "40px 32px", border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: theme.text, marginBottom: 8 }}>Session terminée !</div>
      <div style={{ fontSize: 13, color: theme.textSub, marginBottom: 24 }}>
        Tu as revu <strong style={{ color: acc }}>{cards.length}</strong> carte{cards.length > 1 ? "s" : ""}.
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn color={acc} darkMode={darkMode} onClick={restart}>🔄 Recommencer</Btn>
        <BtnOutline theme={theme} onClick={onBack}>← Menu</BtnOutline>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 580 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "5px 12px", color: theme.textSub, cursor: "pointer", fontSize: 11 }}>
          ← Menu
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: theme.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${acc}, #818cf8)`, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ fontSize: 10, color: theme.muted, marginTop: 4, textAlign: "right" }}>
            {cardIndex + 1} / {cards.length}
          </div>
        </div>
      </div>

      {/* Carte */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          background: theme.card,
          borderRadius: 20,
          border: `2px solid ${flipped ? acc + "80" : theme.border}`,
          padding: "28px",
          cursor: "pointer",
          minHeight: 200,
          boxShadow: flipped ? `0 0 32px ${acc}20` : theme.shadowCard,
          transition: "all 0.25s ease",
          position: "relative",
          userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", top: 14, right: 16, fontSize: 10, color: theme.muted }}>
          {flipped
            ? <span style={{ color: acc, fontWeight: 600 }}>↩ RÉPONSE</span>
            : <span>QUESTION · clic pour révéler</span>}
        </div>
        {cardData?.repetitions > 0 && (
          <div style={{ position: "absolute", top: 14, left: 16, fontSize: 9, color: theme.muted }}>
            🔁 vu {cardData.repetitions}x · dans {cardData.interval}j
          </div>
        )}
        {!flipped ? (
          <div style={{ paddingTop: 24, fontWeight: 600, fontSize: 15, lineHeight: 1.7, color: theme.text }}>
            {card.q}
          </div>
        ) : (
          <div style={{ paddingTop: 24 }}>
            <pre style={{
              whiteSpace: "pre-wrap", fontFamily: "inherit",
              fontSize: 12, lineHeight: 1.9, color: theme.textSub,
              padding: "14px 16px",
              background: darkMode ? "#060912" : "#f5efe3",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
            }}>
              {card.a}
            </pre>
          </div>
        )}
      </div>

      {/* Boutons notation */}
      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
          {[
            { label: "😓 Difficile", sub: "Revoir demain", color: "#ef4444", rating: 1 },
            { label: "🙂 Bien", sub: `Dans ${Math.round((cardData?.interval || 1) * 2.5)}j`, color: "#f59e0b", rating: 2 },
            { label: "😎 Facile", sub: `Dans ${Math.round((cardData?.interval || 1) * 3)}j`, color: "#22c55e", rating: 3 },
          ].map(({ label, sub: s, color, rating }) => (
            <button
              key={rating}
              onClick={() => handleRate(rating)}
              style={{
                padding: "12px 8px", borderRadius: 12,
                border: `2px solid ${color}50`,
                background: color + "15",
                color,
                cursor: "pointer",
                fontFamily: "inherit", fontWeight: 700, fontSize: 12,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = color + "30"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = color + "15"; e.currentTarget.style.transform = "none"; }}
            >
              {label}
              <span style={{ fontSize: 10, fontWeight: 400, color: color + "cc" }}>{s}</span>
            </button>
          ))}
        </div>
      )}

      {!flipped && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button onClick={next} style={{ background: "transparent", border: "none", color: theme.muted, cursor: "pointer", fontSize: 11 }}>
            Passer →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function Empty({ theme, acc }) {
  return (
    <div style={{
      textAlign: "center", color: theme.muted,
      padding: "60px 20px",
      background: theme.card, borderRadius: 16,
      border: `1px dashed ${theme.border}`,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🧩</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: theme.textSub }}>
        Aucune question ici
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        Ajoute-en via <span style={{ color: acc }}>➕ Ajouter</span>
      </div>
    </div>
  );
}

function Btn({ color, darkMode, onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 22px", borderRadius: 10, border: "none",
        background: disabled
          ? "#2a2d3a"
          : `linear-gradient(135deg, ${color}, ${color}bb)`,
        color: disabled ? "#4a5a72" : (darkMode ? "#000" : "#fff"),
        fontWeight: 700, fontSize: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        boxShadow: disabled ? "none" : `0 4px 14px ${color}40`,
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function BtnOutline({ theme, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 18px", borderRadius: 10,
        border: `1.5px solid ${theme.border}`,
        background: "transparent", color: theme.textSub,
        fontWeight: 500, fontSize: 12,
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}