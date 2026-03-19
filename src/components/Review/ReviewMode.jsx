// ─────────────────────────────────────────────────────────────
// src/components/Review/ReviewMode.jsx
//
// Mode révision avec deux sous-modes :
// - "due"  : uniquement les cartes à revoir aujourd'hui (SRS)
// - "all"  : toutes les questions en mode flashcard
// ─────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useSRS } from "../../hooks/useSRS";

export default function ReviewMode() {
    const { sections, theme, darkMode } = useApp();
    const { getCard, review, isDue, dueCount, resetSRS } = useSRS();

    const [mode, setMode] = useState(null);    // null | "due" | "all"
    const [sectionFilter, setSectionFilter] = useState("all");
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [finished, setFinished] = useState(false);

    // Construit la liste de cartes selon le mode et le filtre
    const cards = useMemo(() => {
        const filtered = sectionFilter === "all"
            ? sections
            : sections.filter((s) => s.id === sectionFilter);

        const list = [];
        filtered.forEach((s) => {
            s.content.forEach((q, i) => {
                if (mode === "due" && !isDue(s.id, i)) return;
                list.push({ sectionId: s.id, sectionLabel: s.label, sectionColor: s.color, sectionIcon: s.icon, questionIndex: i, q: q.q, a: q.a });
            });
        });
        return list;
    }, [mode, sectionFilter, sections]);

    const totalDue = dueCount(sections);
    const card = cards[cardIndex];
    const progress = cards.length > 0 ? ((cardIndex) / cards.length) * 100 : 0;

    // Réponse utilisateur
    function handleRate(rating) {
        if (!card) return;
        review(card.sectionId, card.questionIndex, rating);
        next();
    }

    function next() {
        setFlipped(false);
        if (cardIndex + 1 >= cards.length) {
            setFinished(true);
        } else {
            setCardIndex((i) => i + 1);
        }
    }

    function restart() {
        setCardIndex(0);
        setFlipped(false);
        setFinished(false);
    }

    function backToMenu() {
        setMode(null);
        setCardIndex(0);
        setFlipped(false);
        setFinished(false);
    }

    // ── ÉCRAN D'ACCUEIL ──────────────────────────────────────
    if (!mode) return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    color: theme.text,
                    marginBottom: 6,
                }}>
                    🔁 Répétition espacée
                </h2>
                <p style={{ fontSize: 12, color: theme.textSub, lineHeight: 1.7 }}>
                    Revois les questions au bon moment pour mémoriser durablement.
                    Après chaque réponse, note si c'était difficile, bien ou facile —
                    l'algo calcule quand te la représenter.
                </p>
            </div>

            {/* Filtre section */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: theme.muted, letterSpacing: 1, fontWeight: 600, marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>
                    FILTRER PAR SECTION
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <button
                        onClick={() => setSectionFilter("all")}
                        style={{
                            padding: "6px 14px", borderRadius: 20, fontSize: 11,
                            border: `1.5px solid ${sectionFilter === "all" ? "#38bdf8" : theme.border}`,
                            background: sectionFilter === "all" ? "#38bdf820" : "transparent",
                            color: sectionFilter === "all" ? "#38bdf8" : theme.textSub,
                            cursor: "pointer", fontFamily: "inherit", fontWeight: sectionFilter === "all" ? 600 : 400,
                        }}
                    >
                        🌐 Toutes
                    </button>
                    {sections.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSectionFilter(s.id)}
                            style={{
                                padding: "6px 14px", borderRadius: 20, fontSize: 11,
                                border: `1.5px solid ${sectionFilter === s.id ? s.color : theme.border}`,
                                background: sectionFilter === s.id ? s.color + "20" : "transparent",
                                color: sectionFilter === s.id ? s.color : theme.textSub,
                                cursor: "pointer", fontFamily: "inherit", fontWeight: sectionFilter === s.id ? 600 : 400,
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deux modes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Mode SRS */}
                <button
                    onClick={() => { setMode("due"); setCardIndex(0); setFinished(false); }}
                    style={{
                        padding: "24px 20px",
                        borderRadius: 16,
                        border: `2px solid ${totalDue > 0 ? "#f59e0b60" : theme.border}`,
                        background: totalDue > 0 ? "#f59e0b10" : theme.card,
                        cursor: "pointer",
                        textAlign: "left",
                        color: theme.text,
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                    }}
                >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>⏰</div>
                    <div style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: 15,
                        marginBottom: 6,
                        color: totalDue > 0 ? "#f59e0b" : theme.text,
                    }}>
                        À revoir aujourd'hui
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSub, lineHeight: 1.6, marginBottom: 12 }}>
                        Uniquement les cartes dues selon l'algorithme de répétition espacée.
                    </div>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: totalDue > 0 ? "#f59e0b20" : theme.border,
                        color: totalDue > 0 ? "#f59e0b" : theme.muted,
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {totalDue} carte{totalDue > 1 ? "s" : ""} due{totalDue > 1 ? "s" : ""}
                    </div>
                </button>

                {/* Mode Toutes */}
                <button
                    onClick={() => { setMode("all"); setCardIndex(0); setFinished(false); }}
                    style={{
                        padding: "24px 20px",
                        borderRadius: 16,
                        border: `2px solid #38bdf840`,
                        background: "#38bdf810",
                        cursor: "pointer",
                        textAlign: "left",
                        color: theme.text,
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                    }}
                >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>📚</div>
                    <div style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: 15,
                        marginBottom: 6, color: "#38bdf8",
                    }}>
                        Toutes les questions
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSub, lineHeight: 1.6, marginBottom: 12 }}>
                        Révise toutes les questions en mode flashcard, peu importe leur date.
                    </div>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: "#38bdf820",
                        color: "#38bdf8",
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {sections.reduce((t, s) => t + s.content.length, 0)} cartes
                    </div>
                </button>
            </div>

            {/* Stats globales */}
            <StatsPanel sections={sections} getCard={getCard} theme={theme} darkMode={darkMode} resetSRS={resetSRS} />
        </div>
    );

    // ── SESSION TERMINÉE ────────────────────────────────────
    if (finished) return (
        <div style={{
            maxWidth: 500, margin: "40px auto",
            textAlign: "center",
            background: theme.card,
            borderRadius: 20,
            padding: "40px 32px",
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
        }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: 22,
                color: theme.text, marginBottom: 8,
            }}>
                Session terminée !
            </div>
            <div style={{ fontSize: 13, color: theme.textSub, marginBottom: 28 }}>
                Tu as revu <strong style={{ color: "#38bdf8" }}>{cards.length}</strong> question{cards.length > 1 ? "s" : ""}.
                {mode === "due" && " Les prochaines révisions sont planifiées."}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={restart} style={btnStyle("#38bdf8", darkMode)}>
                    🔄 Recommencer
                </button>
                <button onClick={backToMenu} style={btnStyleOutline(theme)}>
                    ← Menu
                </button>
            </div>
        </div>
    );

    // ── AUCUNE CARTE ────────────────────────────────────────
    if (cards.length === 0) return (
        <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: 20,
                color: theme.text, marginBottom: 8,
            }}>
                {mode === "due" ? "Rien à revoir !" : "Aucune question"}
            </div>
            <div style={{ fontSize: 12, color: theme.textSub, marginBottom: 24 }}>
                {mode === "due"
                    ? "Toutes tes cartes sont à jour. Reviens demain ! 🌟"
                    : "Ajoute des questions via l'onglet ➕ Ajouter."}
            </div>
            <button onClick={backToMenu} style={btnStyleOutline(theme)}>← Menu</button>
        </div>
    );

    // ── FLASHCARD ────────────────────────────────────────────
    const cardData = getCard(card.sectionId, card.questionIndex);

    return (
        <div style={{ maxWidth: 620, margin: "0 auto" }}>

            {/* Header session */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <button onClick={backToMenu} style={{
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8, padding: "5px 12px",
                    color: theme.textSub, cursor: "pointer",
                    fontSize: 11, fontFamily: "inherit",
                }}>
                    ← Menu
                </button>

                <div style={{ flex: 1 }}>
                    {/* Barre de progression */}
                    <div style={{
                        height: 6, background: theme.border,
                        borderRadius: 3, overflow: "hidden",
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: `linear-gradient(90deg, ${card.sectionColor}, #818cf8)`,
                            borderRadius: 3,
                            transition: "width 0.4s ease",
                        }} />
                    </div>
                    <div style={{ fontSize: 10, color: theme.muted, marginTop: 4, textAlign: "right" }}>
                        {cardIndex + 1} / {cards.length}
                    </div>
                </div>

                {/* Badge section */}
                <span style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                    background: card.sectionColor + "20",
                    color: card.sectionColor,
                    border: `1px solid ${card.sectionColor}40`,
                    flexShrink: 0,
                }}>
                    {card.sectionIcon} {card.sectionLabel}
                </span>
            </div>

            {/* Carte */}
            <div
                onClick={() => setFlipped(!flipped)}
                style={{
                    background: theme.card,
                    borderRadius: 20,
                    border: `2px solid ${flipped ? card.sectionColor + "60" : theme.border}`,
                    padding: "28px 28px",
                    cursor: "pointer",
                    minHeight: 220,
                    boxShadow: flipped ? `0 0 32px ${card.sectionColor}20` : theme.shadowCard,
                    transition: "all 0.25s ease",
                    position: "relative",
                    userSelect: "none",
                }}
            >
                {/* Indicateur recto/verso */}
                <div style={{
                    position: "absolute",
                    top: 14, right: 16,
                    fontSize: 10, color: theme.muted,
                    display: "flex", alignItems: "center", gap: 4,
                }}>
                    {flipped
                        ? <span style={{ color: card.sectionColor, fontWeight: 600 }}>↩ RÉPONSE</span>
                        : <span>QUESTION · clic pour révéler</span>
                    }
                </div>

                {/* Numéro de révision */}
                {cardData.repetitions > 0 && (
                    <div style={{
                        position: "absolute", top: 14, left: 16,
                        fontSize: 9, color: theme.muted,
                    }}>
                        🔁 vu {cardData.repetitions}x · dans {cardData.interval}j
                    </div>
                )}

                {!flipped ? (
                    // Question
                    <div style={{
                        paddingTop: 24,
                        fontWeight: 600,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: theme.text,
                    }}>
                        {card.q}
                    </div>
                ) : (
                    // Réponse
                    <div style={{ paddingTop: 24 }}>
                        <pre style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                            fontSize: 12,
                            lineHeight: 1.9,
                            color: theme.textSub,
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

            {/* Boutons de notation (visibles uniquement après avoir retourné) */}
            {flipped && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginTop: 16,
                }}>
                    <RateButton
                        label="😓 Difficile"
                        sublabel="Revoir demain"
                        color="#ef4444"
                        onClick={() => handleRate(1)}
                        theme={theme}
                    />
                    <RateButton
                        label="🙂 Bien"
                        sublabel={`Revoir dans ${Math.round((cardData.interval || 1) * 2.5)}j`}
                        color="#f59e0b"
                        onClick={() => handleRate(2)}
                        theme={theme}
                    />
                    <RateButton
                        label="😎 Facile"
                        sublabel={`Revoir dans ${Math.round((cardData.interval || 1) * 3)}j`}
                        color="#22c55e"
                        onClick={() => handleRate(3)}
                        theme={theme}
                    />
                </div>
            )}

            {/* Bouton passer (sans noter) */}
            {!flipped && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <button
                        onClick={next}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: theme.muted,
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                        }}
                    >
                        Passer cette carte →
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Sous-composants ──────────────────────────────────────────

function RateButton({ label, sublabel, color, onClick, theme }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "14px 10px",
                borderRadius: 12,
                border: `2px solid ${color}50`,
                background: color + "15",
                color: color,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = color + "30";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = color + "15";
                e.currentTarget.style.transform = "none";
            }}
        >
            {label}
            <span style={{ fontSize: 10, fontWeight: 400, color: color + "cc" }}>
                {sublabel}
            </span>
        </button>
    );
}

function StatsPanel({ sections, getCard, theme, darkMode, resetSRS }) {
    const today = new Date().toISOString().split("T")[0];

    let total = 0, seen = 0, due = 0, mastered = 0;
    sections.forEach((s) => {
        s.content.forEach((_, i) => {
            total++;
            const c = getCard(s.id, i);
            if (c.lastReview) seen++;
            if (!c.nextReview || c.nextReview <= today) due++;
            if (c.repetitions >= 3) mastered++;
        });
    });

    const stats = [
        { label: "Total", value: total, color: "#38bdf8" },
        { label: "Vues", value: seen, color: "#818cf8" },
        { label: "Dues", value: due, color: "#f59e0b" },
        { label: "Maîtrisées", value: mastered, color: "#22c55e" },
    ];

    return (
        <div style={{ marginTop: 24 }}>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
                marginBottom: 14,
            }}>
                {stats.map(({ label, value, color }) => (
                    <div key={label} style={{
                        padding: "14px 10px",
                        borderRadius: 12,
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        textAlign: "center",
                    }}>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 800, fontSize: 22,
                            color, marginBottom: 2,
                        }}>
                            {value}
                        </div>
                        <div style={{ fontSize: 10, color: theme.muted }}>{label}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => confirm("Réinitialiser toutes les données de révision ?") && resetSRS()}
                style={{
                    background: "transparent",
                    border: `1px solid #ef444440`,
                    borderRadius: 8, padding: "6px 14px",
                    color: "#ef4444", cursor: "pointer",
                    fontSize: 11, fontFamily: "inherit",
                }}
            >
                🗑 Réinitialiser les données de révision
            </button>
        </div>
    );
}

function btnStyle(color, darkMode) {
    return {
        padding: "11px 24px",
        borderRadius: 10,
        border: "none",
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        color: darkMode ? "#000" : "#fff",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: `0 4px 14px ${color}40`,
    };
}

function btnStyleOutline(theme) {
    return {
        padding: "11px 24px",
        borderRadius: 10,
        border: `1.5px solid ${theme.border}`,
        background: "transparent",
        color: theme.textSub,
        fontWeight: 500,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
    };
}