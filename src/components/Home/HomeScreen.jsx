import { useApp } from "../../context/AppContext";
import { IconSearch, IconSliders, IconChevronRight } from "../ui/Icon";

export default function HomeScreen({ onSelectSection }) {
  const { sections } = useApp();
  const featured = sections[0];

  return (
    <div className="home">
      {/* Search */}
      <div className="home-search">
        <span className="home-search__icon"><IconSearch /></span>
        <span className="home-search__placeholder">Rechercher une section...</span>
        <button className="home-search__filter"><IconSliders /></button>
      </div>

      {/* Category chips */}
      <div className="home-chips">
        {sections.map((s) => (
          <button key={s.id} className="home-chip" onClick={() => onSelectSection(s)}>
            <i className={s.icon} />
            <span>{s.label.split(" /")[0]}</span>
          </button>
        ))}
      </div>

      {/* Featured card */}
      {featured && (
        <button className="home-featured" onClick={() => onSelectSection(featured)}>
          <div className="home-featured__deco" />
          <div className="home-featured__deco-2" />
          <i className={`home-featured__icon ${featured.icon}`} />
          <div className="home-featured__content">
            <div className="home-featured__sup">Section du jour</div>
            <div className="home-featured__title">{featured.label}</div>
            <div className="home-featured__meta">
              <span>★ {featured.content.length} cours</span>
              <span>· {featured.quiz.length} QCM</span>
            </div>
            <span className="home-featured__btn">
              Commencer <IconChevronRight />
            </span>
          </div>
        </button>
      )}

      {/* Sections list */}
      <div className="home-list-header">
        <span className="home-list-title">Toutes les sections</span>
        <span className="home-list-count">{sections.length}</span>
      </div>

      <div className="home-section-list">
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
    </div>
  );
}
