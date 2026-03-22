import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import {
  IconSearch, IconSliders, IconChevronRight,
  IconBook, IconZap, IconGrid,
  IconPlay, IconPause, IconRefreshCw, IconClock, IconUser,
} from "../ui/Icon";

// ── Daily section rotation ──────────────────────────────────────
function getDailySection(sections) {
  if (!sections.length) return null;
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return sections[dayOfYear % sections.length];
}

// ── Pomodoro Timer ──────────────────────────────────────────────
const MODES = {
  work: { label: "Focus", duration: 25 * 60, color: "#A89BF2" },
  break: { label: "Pause courte", duration: 5 * 60, color: "#6EE7B7" },
  long: { label: "Pause longue", duration: 15 * 60, color: "#93C5FD" },
};
const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

function PomodoroTimer() {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const total = MODES[mode].duration;
  const progress = timeLeft / total;
  const dash = CIRC * progress;
  const gap = CIRC - dash;

  const reset = useCallback((m = mode) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(MODES[m].duration);
  }, [mode]);

  const switchMode = useCallback((m) => {
    setMode(m);
    reset(m);
  }, [reset]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (mode === "work") {
            setCycles((c) => c + 1);
            switchMode((cycles + 1) % 4 === 0 ? "long" : "break");
          } else {
            switchMode("work");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, cycles, switchMode]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="pomodoro">
      <div className="pomodoro__header">
        <span className="pomodoro__header-icon"><IconClock /></span>
        <span className="pomodoro__header-title">Pomodoro</span>
        <span className="pomodoro__cycles">{cycles} <span>session{cycles !== 1 ? "s" : ""}</span></span>
      </div>

      <div className="pomodoro__mode-tabs">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            className={`pomodoro__mode-tab${mode === key ? " pomodoro__mode-tab--active" : ""}`}
            onClick={() => switchMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pomodoro__ring-wrap">
        <svg className="pomodoro__ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={RADIUS} className="pomodoro__ring-track" />
          <circle
            cx="60" cy="60" r={RADIUS}
            className="pomodoro__ring-progress"
            style={{
              strokeDasharray: `${dash} ${gap}`,
              stroke: MODES[mode].color,
            }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="pomodoro__time">
          <span className="pomodoro__digits">{mins}:{secs}</span>
          <span className="pomodoro__mode-label">{MODES[mode].label}</span>
        </div>
      </div>

      <div className="pomodoro__controls">
        <button className="pomodoro__btn pomodoro__btn--reset" onClick={() => reset(mode)} aria-label="Réinitialiser">
          <IconRefreshCw />
        </button>
        <button className="pomodoro__btn pomodoro__btn--play" onClick={() => setRunning((r) => !r)} aria-label={running ? "Pause" : "Démarrer"}>
          {running ? <IconPause /> : <IconPlay />}
        </button>
      </div>
    </div>
  );
}

// ── About section ───────────────────────────────────────────────
function AboutSection() {
  return (
    <div className="about">
      <div className="about__header">
        <span className="about__header-icon"><IconUser /></span>
        <span className="about__header-title">À propos</span>
      </div>

      <div className="about__card">
        <div className="about__avatar">
          <i className="devicon-react-original colored" style={{ fontSize: "2rem" }} />
        </div>
        <div className="about__identity">
          <div className="about__name">Développeur Web</div>
          <div className="about__role">Bachelor 3 · Alternance</div>
        </div>
      </div>

      <blockquote className="about__quote">
        "Le conte seul apporte l'ennui, le conte fait passer le précepte avec lui."
      </blockquote>

      <p className="about__bio">
        Sur mon temps libre, je cultive cet équilibre : que ce soit à travers le jeu ou la création,
        je crois fermement qu'une application réussie doit être aussi instructive que divertissante.
        Mon voyage a débuté sur le terrain de l'animation péri et extra-scolaire, j'y ai appris
        l'essentiel : capter l'attention, transmettre un savoir et structurer des moments de vie.
        Cette expérience humaine est la fondation de ma capacité à concevoir des projets centrés sur l'utilisateur.
      </p>

      <div className="about__section-title">Contexte du projet</div>
      <p className="about__context">
        Prep Entretien est né d'un besoin concret : centraliser toutes les notions clés du développement
        web dans une interface moderne et installable. Elle est pensée pour
        préparer efficacement les entretiens techniques de Bachelor 1 à 3 que ce soit pour un stage ou bien une alternance.
      </p>

      <div className="about__section-title">Cibles</div>
      <div className="about__chips">
        {["Développeurs juniors", "Étudiants Bachelor MDS", "Alternants"].map((t) => (
          <span key={t} className="about__chip">{t}</span>
        ))}
      </div>

    </div>
  );
}

// ── HomeScreen ──────────────────────────────────────────────────
export default function HomeScreen({ onSelectSection, onGoToSections }) {
  const { sections } = useApp();
  const featured = getDailySection(sections);

  const totalQuestions = sections.reduce((sum, s) => sum + s.content.length, 0);
  const totalQcm = sections.reduce((sum, s) => sum + s.quiz.length, 0);

  return (
    <div className="home">

      {/* Search bar */}
      <div className="home-search">
        <span className="home-search__icon"><IconSearch /></span>
        <span className="home-search__placeholder">Rechercher une section…</span>
        <button className="home-search__filter" aria-label="Filtres"><IconSliders /></button>
      </div>

      {/* Category chips — quick access */}
      <div className="home-chips">
        {sections.map((s) => (
          <button key={s.id} className="home-chip" onClick={() => onSelectSection(s)}>
            <i className={s.icon} />
            <span>{s.label.split(" /")[0]}</span>
          </button>
        ))}
      </div>

      {/* Featured card — section du jour */}
      {featured && (
        <button className="home-featured" onClick={() => onSelectSection(featured)}>
          <div className="home-featured__deco" />
          <div className="home-featured__deco-2" />
          <i className={`home-featured__icon ${featured.icon}`} />
          <div className="home-featured__content">
            <div className="home-featured__sup">Section du jour</div>
            <div className="home-featured__title">{featured.label}</div>
            <div className="home-featured__meta">
              <span>{featured.content.length} cours</span>
              <span>· {featured.quiz.length} QCM</span>
            </div>
            <span className="home-featured__btn">
              Commencer <IconChevronRight />
            </span>
          </div>
        </button>
      )}

      {/* Stats overview */}
      <div className="home-stats">
        <div className="home-stat">
          <div className="home-stat__icon"><IconBook /></div>
          <div className="home-stat__value">{totalQuestions}</div>
          <div className="home-stat__label">Questions</div>
        </div>
        <div className="home-stat">
          <div className="home-stat__icon"><IconZap /></div>
          <div className="home-stat__value">{totalQcm}</div>
          <div className="home-stat__label">QCM</div>
        </div>
        <div className="home-stat">
          <div className="home-stat__icon"><IconGrid /></div>
          <div className="home-stat__value">{sections.length}</div>
          <div className="home-stat__label">Sections</div>
        </div>
      </div>

      {/* Quick access to sections */}
      <button className="home-browse-btn" onClick={onGoToSections}>
        <span>Parcourir toutes les sections</span>
        <IconChevronRight />
      </button>

      {/* Pomodoro timer */}
      <PomodoroTimer />

      {/* About */}
      <AboutSection />

    </div>
  );
}
