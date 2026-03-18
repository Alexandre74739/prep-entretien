// src/App.jsx
import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import Topbar from "./components/Layout/Topbar";
import Sidebar from "./components/Layout/Sidebar";
import CoursList from "./components/Cours/CoursList";
import QuizPanel from "./components/Quiz/QuizPanel";
import AddForm from "./components/Add/AddForm";

export default function App() {
  const { sections, theme, darkMode } = useApp();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "htmlcss");
  const [tab, setTab] = useState("cours");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const section = sections.find((s) => s.id === activeId);
  const acc = section?.color || "#38bdf8";

  // Détecte le redimensionnement
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setPanelOpen(false);
      else setPanelOpen(true);
    };
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);

  function handleSectionChange(id) {
    setActiveId(id);
    setTab("cours");
    // Sur mobile : ouvre le panneau quand on sélectionne une section
    if (isMobile) setPanelOpen(true);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      fontSize: 13,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }
        textarea, input, select, button { font-family: inherit; }
        .tab-btn:hover { opacity: 0.85; }
      `}</style>

      <Topbar
        isMobile={isMobile}
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        section={section}
      />

      <div style={{
        display: "flex",
        height: "calc(100vh - 53px)",
        overflow: "hidden",
      }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          // Mobile : pleine largeur quand panneau fermé, cachée quand ouvert
          // Desktop : toujours visible
          width: isMobile ? (panelOpen ? 0 : "100%") : 175,
          minWidth: isMobile ? (panelOpen ? 0 : "100%") : 175,
          overflow: "hidden",
          transition: "width 0.25s ease, min-width 0.25s ease",
          borderRight: isMobile ? "none" : `1px solid ${theme.border}`,
        }}>
          <Sidebar activeId={activeId} onSelect={handleSectionChange} isMobile={isMobile} />
        </div>

        {/* ── PANNEAU PRINCIPAL ── */}
        <div style={{
          flex: 1,
          width: isMobile ? (panelOpen ? "100%" : 0) : "auto",
          overflow: panelOpen ? "auto" : "hidden",
          transition: "width 0.25s ease",
          padding: panelOpen ? "20px 24px" : 0,
          opacity: panelOpen ? 1 : 0,
          maxWidth: isMobile ? "100%" : 820,
        }}>
          {panelOpen && section && (
            <>
              {/* Onglets */}
              <div style={{
                display: "flex",
                gap: 4,
                marginBottom: 20,
                borderBottom: `1px solid ${theme.border}`,
                paddingBottom: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}>
                {/* Bouton retour sur mobile */}
                {isMobile && (
                  <button
                    onClick={() => setPanelOpen(false)}
                    style={{
                      padding: "6px 10px",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 6,
                      background: "transparent",
                      color: theme.muted,
                      cursor: "pointer",
                      fontSize: 12,
                      marginRight: 4,
                    }}
                  >
                    ← Retour
                  </button>
                )}

                {[
                  { id: "cours", label: "📖 Cours" },
                  { id: "quiz",  label: `🧪 Quiz (${section.quiz.length})` },
                  { id: "add",   label: "➕ Ajouter" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    className="tab-btn"
                    onClick={() => setTab(id)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      background: tab === id ? acc : theme.border,
                      color: tab === id ? (darkMode ? "#000" : "#fff") : theme.muted,
                      fontWeight: tab === id ? 600 : 400,
                    }}
                  >
                    {label}
                  </button>
                ))}

                <span style={{ marginLeft: "auto", fontSize: 11, color: theme.muted }}>
                  {section.icon} {section.label}
                </span>
              </div>

              {/* Contenu */}
              {tab === "cours" && <CoursList section={section} />}
              {tab === "quiz"  && <QuizPanel section={section} />}
              {tab === "add"   && (
                <AddForm
                  currentSectionId={activeId}
                  onSectionCreated={(id) => { setActiveId(id); setTab("cours"); }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}