import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import Topbar from "./components/Layout/Topbar";
import BottomNav from "./components/Layout/BottomNav";
import HomeScreen from "./components/Home/HomeScreen";
import SectionsList from "./components/Home/SectionsList";
import CoursList from "./components/Cours/CoursList";
import QuizPanel from "./components/Quiz/QuizPanel";
import AddForm from "./components/Add/AddForm";
import InterviewQuiz from "./components/Quiz/InterviewQuiz";
import InstallBanner from "./components/Layout/InstallBanner";
import SplashScreen from "./components/Layout/SplashScreen";
import { IconBook, IconTarget } from "./components/ui/Icon";

export default function App() {
  const { sections, darkMode } = useApp();

  // Navigation state
  const [navActive, setNavActive] = useState("home");
  // 'home' | 'sections' | 'section-detail' | 'quiz-entretien' | 'add'
  const [view, setView] = useState("home");
  const [activeSection, setActiveSection] = useState(null);
  const [sectionTab, setSectionTab] = useState("cours");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function handleSelectSection(section) {
    setActiveSection(section);
    setSectionTab("cours");
    setView("section-detail");
  }

  function handleNavChange(nav) {
    setNavActive(nav);
    if (nav === "home") setView("home");
    if (nav === "sections") setView("sections");
    if (nav === "quiz") setView("quiz-entretien");
    if (nav === "add") setView("add");
    if (nav !== "section-detail") setActiveSection(null);
  }

  function handleBack() {
    // When going back from section-detail, return to previous nav
    setView(navActive === "sections" ? "sections" : "home");
    setActiveSection(null);
  }

  return (
    <div className="app">
      <Topbar
        view={view}
        activeSection={activeSection}
        onBack={handleBack}
      />

      <main className="app-main">
        {view === "home" && (
          <div className="fade-in">
            <HomeScreen onSelectSection={handleSelectSection} />
          </div>
        )}

        {view === "sections" && (
          <div className="fade-in">
            <SectionsList onSelectSection={handleSelectSection} />
          </div>
        )}

        {view === "section-detail" && activeSection && (
          <div className="fade-in" key={activeSection.id}>
            <div className="section-tabs-bar">
              {[
                { id: "cours", icon: <IconBook />,   label: "Cours" },
                { id: "quiz",  icon: <IconTarget />, label: `Quiz · ${activeSection.quiz.length}` },
                { id: "add",   icon: <span>＋</span>, label: "Ajouter" },
              ].map(({ id, icon, label }) => (
                <button
                  key={id}
                  className={`tab-btn${sectionTab === id ? " tab-btn--active" : ""}`}
                  onClick={() => setSectionTab(id)}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="section-content" key={`${activeSection.id}-${sectionTab}`}>
              {sectionTab === "cours" && <CoursList section={activeSection} />}
              {sectionTab === "quiz"  && <QuizPanel section={activeSection} />}
              {sectionTab === "add"   && (
                <AddForm
                  currentSectionId={activeSection.id}
                  onSectionCreated={(id) => {
                    const s = sections.find((x) => x.id === id);
                    if (s) handleSelectSection(s);
                    setSectionTab("cours");
                  }}
                />
              )}
            </div>
          </div>
        )}

        {view === "quiz-entretien" && (
          <div className="fade-in">
            <InterviewQuiz />
          </div>
        )}

        {view === "add" && (
          <div className="fade-in">
            <AddForm
              currentSectionId={sections[0]?.id}
              onSectionCreated={(id) => {
                const s = sections.find((x) => x.id === id);
                if (s) handleSelectSection(s);
              }}
            />
          </div>
        )}
      </main>

      <BottomNav active={view === "section-detail" ? navActive : view} onChange={handleNavChange} />
      <InstallBanner />
      <SplashScreen />
    </div>
  );
}
