import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import Topbar from "./components/Layout/Topbar";
import Sidebar from "./components/Layout/Sidebar";
import CoursList from "./components/Cours/CoursList";
import QuizPanel from "./components/Quiz/QuizPanel";
import AddForm from "./components/Add/AddForm";

export default function App() {
  const { sections, theme, darkMode } = useApp();
  const [activeId, setActiveId]       = useState(sections[0]?.id ?? "htmlcss");
  const [tab, setTab]                 = useState("cours");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile]       = useState(false);

  const section = sections.find((s) => s.id === activeId);
  const acc     = section?.color || "#38bdf8";

  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      setSidebarOpen(!m);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSelect = (id) => {
    setActiveId(id);
    setTab("cours");
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? "#1e2d45" : "#c8b99a"}; border-radius: 4px; }

        textarea, input, select, button { font-family: inherit; }

        .btn-tab {
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-tab:hover {
          transform: translateY(-1px);
        }
        .card-q {
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .card-q:hover {
          transform: translateY(-1px);
          box-shadow: ${theme.shadow};
        }
        .opt-btn {
          transition: all 0.15s ease;
        }
        .opt-btn:hover:not(:disabled) {
          transform: translateX(3px);
        }
        .nav-pill:hover {
          transform: translateX(2px);
        }
        .nav-pill { transition: all 0.15s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.25s ease forwards; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      

      <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden", position: "relative" }}>

        {/* ── SIDEBAR OVERLAY (mobile) ── */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(2px)",
              zIndex: 20,
            }}
          />
        )}

        {/* ── SIDEBAR ── */}
        <div style={{
          position: isMobile ? "absolute" : "relative",
          top: 0, left: 0, bottom: 0,
          width: isMobile ? 260 : (sidebarOpen ? 200 : 0),
          minWidth: isMobile ? undefined : (sidebarOpen ? 200 : 0),
          transform: isMobile
            ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)")
            : "none",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s",
          zIndex: isMobile ? 30 : 1,
          overflow: "hidden",
          borderRight: `1px solid ${theme.border}`,
          background: theme.card,
          boxShadow: isMobile && sidebarOpen ? "4px 0 32px rgba(0,0,0,0.3)" : "none",
          flexShrink: 0,
        }}>
          <Sidebar activeId={activeId} onSelect={handleSelect} />
        </div>

        {/* ── MAIN ── */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: isMobile ? "16px 14px" : "24px 32px",
        }}>
          {/* Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
            flexWrap: "wrap",
          }}>
            {/* Indicateur section active */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginRight: 8,
              paddingRight: 14,
              borderRight: `1px solid ${theme.border}`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: acc,
                boxShadow: `0 0 8px ${acc}`,
                animation: "pulse-dot 2s infinite",
              }}/>
              <span style={{ fontSize: 11, fontWeight: 600, color: acc, fontFamily: "'Syne', sans-serif" }}>
                {section?.label ?? "—"}
              </span>
            </div>

            {[
              { id: "cours", icon: "📖", label: "Cours" },
              { id: "quiz",  icon: "🧪", label: `Quiz · ${section?.quiz.length ?? 0}` },
              { id: "add",   icon: "➕", label: "Ajouter" },
            ].map(({ id, icon, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  className="btn-tab"
                  onClick={() => setTab(id)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    border: active ? `1.5px solid ${acc}` : `1.5px solid ${theme.border}`,
                    background: active
                      ? (darkMode ? acc + "22" : acc + "18")
                      : "transparent",
                    color: active ? acc : theme.textSub,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Contenu */}
          <div className="fade-in" key={`${activeId}-${tab}`}>
            {section && tab === "cours" && <CoursList section={section} />}
            {section && tab === "quiz"  && <QuizPanel section={section} />}
            {tab === "add" && (
              <AddForm
                currentSectionId={activeId}
                onSectionCreated={(id) => { setActiveId(id); setTab("cours"); }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}