// ─────────────────────────────────────────────────────────────
// src/App.jsx
//
// Composant racine : assemble les briques.
// La logique métier est dans le contexte (AppContext).
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "./context/AppContext";
import Topbar from "./components/Layout/Topbar";
import Sidebar from "./components/Layout/Sidebar";
import CoursList from "./components/Cours/CoursList";
import QuizPanel from "./components/Quiz/QuizPanel";
import AddForm from "./components/Add/AddForm";

const TABS = [
  { id: "cours", label: "📖 Cours" },
  { id: "quiz", label: "🧪 Quiz" },
  { id: "add", label: "➕ Ajouter" },
];

export default function App() {
  const { sections, theme, darkMode } = useApp();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "htmlcss");
  const [tab, setTab] = useState("cours");

  const section = sections.find((s) => s.id === activeId);

  function handleSectionChange(id) {
    setActiveId(id);
    setTab("cours");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
        fontSize: 13,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }
        textarea, input, select, button { font-family: inherit; }
      `}</style>

      <Topbar />

      <div style={{ display: "flex", height: "calc(100vh - 53px)" }}>
        <Sidebar activeId={activeId} onSelect={handleSectionChange} />

        <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 800 }}>
          {/* Onglets */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              borderBottom: `1px solid ${theme.border}`,
              paddingBottom: 12,
              alignItems: "center",
            }}
          >
            {TABS.map(({ id, label }) => {
              const isActive = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    background: isActive ? section?.color : theme.border,
                    color: isActive ? (darkMode ? "#000" : "#fff") : theme.muted,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {id === "quiz" ? `🧪 Quiz (${section?.quiz.length ?? 0})` : label}
                </button>
              );
            })}

            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: theme.muted,
              }}
            >
              {section?.icon} {section?.label}
            </span>
          </div>

          {/* Contenu selon l'onglet actif */}
          {section && tab === "cours" && <CoursList section={section} />}
          {section && tab === "quiz" && <QuizPanel section={section} />}
          {tab === "add" && (
            <AddForm
              currentSectionId={activeId}
              onSectionCreated={(id) => {
                setActiveId(id);
                setTab("cours");
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}