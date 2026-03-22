import { IconHome, IconGrid, IconZap, IconPlus } from "../ui/Icon";

const NAV_ITEMS = [
  { id: "home",     Icon: IconHome, label: "Accueil" },
  { id: "sections", Icon: IconGrid, label: "Sections" },
  { id: "quiz",     Icon: IconZap,  label: "Quiz" },
  { id: "add",      Icon: IconPlus, label: "Ajouter" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ id, Icon, label }) => (
        <button
          key={id}
          className={`bottom-nav__item${active === id ? " bottom-nav__item--active" : ""}`}
          onClick={() => onChange(id)}
          aria-label={label}
        >
          <Icon />
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
