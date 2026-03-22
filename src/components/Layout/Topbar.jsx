import { useApp } from "../../context/AppContext";
import { IconBriefcase, IconSun, IconMoon, IconChevronLeft, IconMic } from "../ui/Icon";

export default function Topbar({ view, activeSection, onBack }) {
  const { darkMode, setDarkMode } = useApp();

  const themeBtn = (
    <button className="topbar-theme-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Thème">
      {darkMode ? <IconSun /> : <IconMoon />}
    </button>
  );

  if (view === "home") {
    return (
      <header className="topbar topbar--home">
        <div className="topbar-logo">
          <div className="topbar-logo__icon"><IconBriefcase /></div>
          <div className="topbar-logo__title">Prep Entretien</div>
        </div>
        <div className="topbar-spacer" />
        {themeBtn}
      </header>
    );
  }

  if (view === "section-detail" && activeSection) {
    return (
      <header className="topbar topbar--detail">
        <button className="topbar-back" onClick={onBack} aria-label="Retour">
          <IconChevronLeft />
        </button>
        <div className="topbar-detail-info">
          <i className={`topbar-detail-icon ${activeSection.icon}`} />
          <span className="topbar-detail-name">{activeSection.label}</span>
        </div>
        <div className="topbar-spacer" />
        {themeBtn}
      </header>
    );
  }

  if (view === "quiz-entretien") {
    return (
      <header className="topbar topbar--screen">
        <span className="topbar-screen-icon"><IconMic /></span>
        <span className="topbar-screen-title">Quiz Entretien</span>
        <div className="topbar-spacer" />
        {themeBtn}
      </header>
    );
  }

  const titles = { sections: "Sections", add: "Ajouter" };
  return (
    <header className="topbar topbar--screen">
      <span className="topbar-screen-title">{titles[view] ?? ""}</span>
      <div className="topbar-spacer" />
      {themeBtn}
    </header>
  );
}
