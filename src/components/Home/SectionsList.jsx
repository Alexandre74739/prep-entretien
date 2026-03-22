import { useApp } from "../../context/AppContext";
import { IconChevronRight } from "../ui/Icon";

export default function SectionsList({ onSelectSection }) {
  const { sections } = useApp();

  return (
    <div className="sections-list">
      {sections.map((s) => (
        <button key={s.id} className="home-section-card" onClick={() => onSelectSection(s)}>
          <div className="home-section-card__icon">
            <i className={s.icon} />
          </div>
          <div className="home-section-card__info">
            <div className="home-section-card__name">{s.label}</div>
            <div className="home-section-card__meta">
              {s.content.length} cours · {s.quiz.length} QCM
              {s.content.filter((q) => q.custom).length > 0 && (
                <span className="home-section-card__custom">
                  +{s.content.filter((q) => q.custom).length} perso
                </span>
              )}
            </div>
          </div>
          <span className="home-section-card__arrow"><IconChevronRight /></span>
        </button>
      ))}
    </div>
  );
}
