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
  const [activeId, setActiveId]   = useState(sections[0]?.id ?? "htmlcss");
  const [tab, setTab]             = useState("cours");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

  const section = sections.find((s) => s.id === activeId);
  const acc = section?.color || "#38bdf8";

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Sur mobile : sidebar fermée par défaut si une section est sélectionnée
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);

  function handleSectionChange(id) {
    setActiveId(id);
    setTab("cours");
    if (isMobile) setSidebarOpen(false); // ferme la sidebar après sélection sur mobile
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
      `}</style>

      <Topbar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        section={section}
      />

      <div style={{
        display: "flex",
        height: "calc(100vh - 53px)",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* ── SIDEBAR (categories) ── */}
        {isMobile ? (
          // Mobile : overlay par dessus le contenu
          <>
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "absolute", inset: 0,
                  background: "#00000050", zIndex: 20,
                }}
              />
            )}
            <div style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0,
              width: 240,
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.25s ease",
              zIndex: 30,
              boxShadow: sidebarOpen ? "4px 0 20px #00000030" : "none",
            }}>
              <Sidebar
                activeId={activeId}
                onSelect={handleSectionChange}
                isMobile={isMobile}
              />
            </div>
          </>
        ) : (
          // Desktop : sidebar qui se réduit
          <div style={{
            width: sidebarOpen ? 175 : 0,
            minWidth: sidebarOpen ? 175 : 0,
            overflow: "hidden",
            transition: "width 0.25s ease, min-width 0.25s ease",
            borderRight: `1px solid ${theme.border}`,
          }}>
            <Sidebar
              activeId={activeId}
              onSelect={handleSectionChange}
              isMobile={false}
            />
          </div>
        )}

        {/* ── CONTENU PRINCIPAL ── */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
          maxWidth: isMobile ? "100%" : 820,
        }}>
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
            {[
              { id: "cours", label: "📖 Cours" },
              { id: "quiz",  label: `🧪 Quiz (${section?.quiz.length ?? 0})` },
              { id: "add",   label: "➕ Ajouter" },
            ].map(({ id, label }) => (
              <button
                key={id}
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
                  transition: "opacity 0.15s",
                }}
              >
                {label}
              </button>
            ))}

            <span style={{ marginLeft: "auto", fontSize: 11, color: theme.muted }}>
              {section?.icon} {section?.label}
            </span>
          </div>

          {section && tab === "cours" && <CoursList section={section} />}
          {section && tab === "quiz"  && <QuizPanel section={section} />}
          {tab === "add" && (
            <AddForm
              currentSectionId={activeId}
              onSectionCreated={(id) => { setActiveId(id); setTab("cours"); }}
            />
          )}
        </main>
      </div>
    </div>
  );
}