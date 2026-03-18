// ─────────────────────────────────────────────────────────────
// client/src/context/AppContext.jsx
//
// Version mise à jour : utilise l'API Node.js au lieu de localStorage.
//
// Au chargement, on fetch les questions custom depuis le serveur
// et on les fusionne avec les sections de base (BASE_SECTIONS).
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";
import { BASE_SECTIONS } from "../data/sections";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { themes } from "../theme";
import { questionsApi, quizApi, sectionsApi } from "../services/api";

const AppContext = createContext(null);

// Fusionne les sections de base avec les données reçues de l'API
function buildSections(customQuestions, customQuizItems, customSections) {
  // Sections de base + questions custom chargées depuis l'API
  const merged = BASE_SECTIONS.map((section) => {
    const extraQ = customQuestions.filter((q) => q.section_id === section.id);
    const extraQz = customQuizItems.filter((q) => q.section_id === section.id);

    return {
      ...section,
      content: [
        ...section.content,
        ...extraQ.map((q) => ({
          id: q.id,         // on garde l'ID BDD pour pouvoir supprimer/modifier
          q: q.question,
          a: q.answer,
          custom: true,
        })),
      ],
      quiz: [
        ...section.quiz,
        ...extraQz,
      ],
    };
  });

  // Ajouter les sections entièrement custom
  customSections.forEach((cs) => {
    const existingIds = merged.map((s) => s.id);
    if (!existingIds.includes(cs.id)) {
      const extraQ = customQuestions.filter((q) => q.section_id === cs.id);
      const extraQz = customQuizItems.filter((q) => q.section_id === cs.id);
      merged.push({
        id: cs.id,
        label: cs.label,
        icon: cs.icon,
        color: cs.color,
        content: extraQ.map((q) => ({ id: q.id, q: q.question, a: q.answer, custom: true })),
        quiz: extraQz,
      });
    }
  });

  return merged;
}

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("prep-dark", true);
  const [sections, setSections] = useState(BASE_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // ── Chargement initial depuis l'API ────────────────────────
  useEffect(() => {
    async function loadFromApi() {
      try {
        const [questions, quizItems, customSections] = await Promise.all([
          questionsApi.getAll(),
          // On fetch les quiz de toutes les sections connues
          Promise.all(
            BASE_SECTIONS.map((s) => quizApi.getBySection(s.id))
          ).then((results) => results.flat()),
          sectionsApi.getAll(),
        ]);

        setSections(buildSections(questions, quizItems, customSections));
        setApiError(false);
      } catch (e) {
        console.warn("⚠️ Serveur non disponible, mode hors-ligne activé :", e.message);
        setApiError(true);
        // On reste sur les données de base si le serveur est éteint
        setSections(BASE_SECTIONS);
      } finally {
        setLoading(false);
      }
    }

    loadFromApi();
  }, []);

  // ── Ajouter une question ───────────────────────────────────
  async function addQuestion({ sectionId, question, answer, quizItem }) {
    // 1. Appel API
    const { id } = await questionsApi.create({ sectionId, question, answer });

    // 2. Si quiz coché, ajoute aussi le QCM
    let createdQuizItem = null;
    if (quizItem) {
      const { id: quizId } = await quizApi.create({ sectionId, ...quizItem });
      createdQuizItem = { ...quizItem, id: quizId, custom: true };
    }

    // 3. Mise à jour de l'état local (sans refetch)
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              content: [...s.content, { id, q: question, a: answer, custom: true }],
              quiz: createdQuizItem ? [...s.quiz, createdQuizItem] : s.quiz,
            }
      )
    );
  }

  // ── Modifier une question ──────────────────────────────────
  async function updateQuestion({ sectionId, questionId, question, answer }) {
    await questionsApi.update(questionId, { question, answer });

    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              content: s.content.map((c) =>
                c.id === questionId ? { ...c, q: question, a: answer } : c
              ),
            }
      )
    );
  }

  // ── Supprimer une question ─────────────────────────────────
  async function deleteQuestion({ sectionId, questionId }) {
    await questionsApi.delete(questionId);

    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, content: s.content.filter((c) => c.id !== questionId) }
      )
    );
  }

  // ── Créer une nouvelle section ─────────────────────────────
  async function addSection({ label, icon, color }) {
    const id = "custom_" + Date.now();
    await sectionsApi.create({ id, label, icon, color });

    const newSection = { id, label, icon: icon || "📝", color: color || "#f472b6", content: [], quiz: [] };
    setSections((prev) => [...prev, newSection]);
    return id;
  }

  const theme = darkMode ? themes.dark : themes.light;

  return (
    <AppContext.Provider
      value={{
        sections,
        loading,
        apiError,
        darkMode,
        setDarkMode,
        theme,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans <AppProvider>");
  return ctx;
}