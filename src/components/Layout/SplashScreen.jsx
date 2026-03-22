import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { IconBriefcase } from "../ui/Icon";

const MIN_DISPLAY = 4500; // ms minimum avant de masquer

export default function SplashScreen() {
  const { loading } = useApp();
  const [visible, setVisible] = useState(true);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!loading) {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, MIN_DISPLAY - elapsed);
      // remaining = temps qu'il reste pour atteindre le minimum + 500ms pour l'animation de sortie
      const t = setTimeout(() => setVisible(false), remaining + 500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className={`splash${!loading ? " splash--exit" : ""}`}>
      <div className="splash__inner">
        <div className="splash__logo">
          <IconBriefcase />
        </div>
        <div className="splash__name">PrepCode</div>
        <div className="splash__tagline">Préparez votre entretien</div>
        <div className="splash__bar">
          <div className={`splash__bar-fill${!loading ? " splash__bar-fill--done" : ""}`} />
        </div>
      </div>
    </div>
  );
}
