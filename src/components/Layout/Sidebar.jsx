import { useApp } from "../../context/AppContext";
import { IconMic } from "../ui/Icon";

export default function Sidebar({ activeId, onSelect, onInterviewQuiz }) {
  const { sections } = useApp();

  return (
    <nav className="sidebar">
      <div className="sidebar-label">Sections</div>

      <div className="sidebar-items">
        {sections.map((s) => {
          const active = activeId === s.id;
          const customCount = s.content.filter((q) => q.custom).length;

          return (
            <button
              key={s.id}
              className={`nav-item${active ? " nav-item--active" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <i className={`nav-item__icon ${s.icon}`} />
              <span className="nav-item__label">{s.label}</span>
              {customCount > 0 && (
                <span className="nav-item__badge">+{customCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interview Quiz */}
      <div className="sidebar-bottom">
        <div className="sidebar-sep" />
        <button
          className={`nav-item nav-item--interview${activeId === "__interview__" ? " is-active" : ""}`}
          onClick={onInterviewQuiz}
        >
          <span className="nav-item__icon"><IconMic /></span>
          <div className="nav-item__info">
            <div className="nav-item__title">Quiz Entretien</div>
            <div className="nav-item__sub">10 questions · toutes sections</div>
          </div>
          <span className="nav-item__pulse" />
        </button>
      </div>
    </nav>
  );
}
