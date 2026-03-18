// ─────────────────────────────────────────────────────────────
// src/context/AppContext.jsx
//
// Contexte global de l'application.
// Gère : sections (base + custom), thème sombre/clair,
//        et la sauvegarde automatique dans localStorage.
//
// Structure sauvegardée dans localStorage (clé "prep-additions") :
// {
//   additions: {
//     "htmlcss": { content: [...questions custom], quiz: [...] },
//     "js":      { content: [...], quiz: [...] },
//     ...
//   },
//   customSections: [
//     { id, label, icon, color, content: [...], quiz: [...] }
//   ]
// }
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";
import { BASE_SECTIONS } from "../data/sections";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { themes } from "../theme";

const AppContext = createContext(null);

// ── Fusion des sections de base avec les additions sauvegardées ──
function mergeSections(base, saved) {
  const merged = base.map((section) => {
    const add = saved.additions?.[section.id];
    if (!add) return section;
    return {
      ...section,
      content: [...section.content, ...(add.content ?? [])],
      quiz: [...section.quiz, ...(add.quiz ?? [])],
    };
  });

  // Ajouter les sections entièrement custom
  if (saved.customSections?.length) {
    const existingIds = merged.map((s) => s.id);
    saved.customSections.forEach((cs) => {
      if (!existingIds.includes(cs.id)) merged.push(cs);
    });
  }

  return merged;
}

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("prep-dark", true);
  const [savedData, setSavedData] = useLocalStorage("prep-additions", {
    additions: {},
    customSections: [],
  });

  const [sections, setSections] = useState(() =>
    mergeSections(BASE_SECTIONS, savedData)
  );

  // Quand savedData change (chargement initial), re-merger
  useEffect(() => {
    setSections(mergeSections(BASE_SECTIONS, savedData));
  }, []); // eslint-disable-line

  // ── Ajouter une question à une section existante ──────────────
  function addQuestion({ sectionId, question, answer, quizItem }) {
    const newContent = { q: question, a: answer, custom: true };

    // Mettre à jour la vue
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              content: [...s.content, newContent],
              quiz: quizItem ? [...s.quiz, { ...quizItem, custom: true }] : s.quiz,
            }
      )
    );

    // Persister dans localStorage
    setSavedData((prev) => {
      const existing = prev.additions?.[sectionId] ?? { content: [], quiz: [] };
      return {
        ...prev,
        additions: {
          ...prev.additions,
          [sectionId]: {
            content: [...existing.content, newContent],
            quiz: quizItem
              ? [...existing.quiz, { ...quizItem, custom: true }]
              : existing.quiz,
          },
        },
      };
    });
  }

  // ── Créer une nouvelle section entière ────────────────────────
  function addSection({ label, icon, color }) {
    const id = "custom_" + Date.now();
    const newSection = {
      id,
      label,
      icon: icon || "📝",
      color: color || "#f472b6",
      content: [],
      quiz: [],
    };

    setSections((prev) => [...prev, newSection]);

    setSavedData((prev) => ({
      ...prev,
      customSections: [...(prev.customSections ?? []), newSection],
    }));

    return id; // retourne l'id pour y naviguer directement
  }

  // ── Supprimer une question custom ─────────────────────────────
  function deleteQuestion({ sectionId, questionIndex }) {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const newContent = s.content.filter((_, i) => i !== questionIndex);
        return { ...s, content: newContent };
      })
    );

    // Recalculer ce qui doit être persisté
    setSavedData((prev) => {
      const baseSection = BASE_SECTIONS.find((s) => s.id === sectionId);
      const baseCount = baseSection?.content.length ?? 0;
      const currentSection = sections.find((s) => s.id === sectionId);
      if (!currentSection) return prev;

      const newCustomContent = currentSection.content
        .filter((_, i) => i !== questionIndex)
        .filter((_, i) => i >= baseCount);

      return {
        ...prev,
        additions: {
          ...prev.additions,
          [sectionId]: {
            content: newCustomContent,
            quiz: prev.additions?.[sectionId]?.quiz ?? [],
          },
        },
      };
    });
  }

  // ── Tout réinitialiser (questions custom uniquement) ──────────
  function resetCustom() {
    setSavedData({ additions: {}, customSections: [] });
    setSections(BASE_SECTIONS);
  }

  const theme = darkMode ? themes.dark : themes.light;

  return (
    <AppContext.Provider
      value={{
        sections,
        darkMode,
        setDarkMode,
        theme,
        addQuestion,
        addSection,
        deleteQuestion,
        resetCustom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook raccourci pour consommer le contexte
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans <AppProvider>");
  return ctx;
}