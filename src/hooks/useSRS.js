// ─────────────────────────────────────────────────────────────
// src/hooks/useSRS.js
//
// Système de Répétition Espacée (SRS) — algorithme simplifié SM-2.
//
// Principe : après avoir vu une carte, tu notes si c'était
// Difficile / Bien / Facile. L'algo calcule quand la revoir.
//
// Structure sauvegardée dans localStorage (clé "prep-srs") :
// {
//   "htmlcss__0": {
//     interval:    1,          // jours avant la prochaine révision
//     ease:        2.5,        // facteur de facilité (augmente si Facile)
//     repetitions: 0,          // nombre de fois bien répondu d'affilée
//     nextReview:  "2026-03-20", // date ISO
//     lastReview:  "2026-03-19",
//   }
// }
// ─────────────────────────────────────────────────────────────

import { useLocalStorage } from "./useLocalStorage";

// Crée une clé unique pour chaque question
export function cardKey(sectionId, questionIndex) {
  return `${sectionId}__${questionIndex}`;
}

// Algorithme SM-2 simplifié
// rating : 1 = Difficile, 2 = Bien, 3 = Facile
function calcNext(card, rating) {
  let { interval, ease, repetitions } = card;

  if (rating === 1) {
    // Difficile : on repart à 0
    repetitions = 0;
    interval    = 1;
  } else {
    // Bien ou Facile
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 3;
    else interval = Math.round(interval * ease);

    repetitions += 1;

    // Ajuste le facteur de facilité
    // Facile → ease monte, Bien → stable, Difficile → ease baisse
    ease = Math.max(1.3, ease + (rating === 3 ? 0.15 : rating === 2 ? 0 : -0.2));
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    ease,
    repetitions,
    nextReview:  nextReview.toISOString().split("T")[0],
    lastReview:  new Date().toISOString().split("T")[0],
  };
}

export function useSRS() {
  const [srsData, setSrsData] = useLocalStorage("prep-srs", {});

  // Récupère les infos d'une carte (ou valeurs par défaut)
  function getCard(sectionId, questionIndex) {
    const key = cardKey(sectionId, questionIndex);
    return srsData[key] ?? {
      interval:    0,
      ease:        2.5,
      repetitions: 0,
      nextReview:  null, // null = jamais vue = à revoir maintenant
      lastReview:  null,
    };
  }

  // Enregistre la réponse (1 = Difficile, 2 = Bien, 3 = Facile)
  function review(sectionId, questionIndex, rating) {
    const key  = cardKey(sectionId, questionIndex);
    const card = getCard(sectionId, questionIndex);
    const next = calcNext(card, rating);
    setSrsData((prev) => ({ ...prev, [key]: next }));
  }

  // Retourne true si la carte est due aujourd'hui ou avant
  function isDue(sectionId, questionIndex) {
    const card = getCard(sectionId, questionIndex);
    if (!card.nextReview) return true; // jamais vue
    return card.nextReview <= new Date().toISOString().split("T")[0];
  }

  // Nombre de cartes dues pour une section (ou toutes si sectionId null)
  function dueCount(sections) {
    return sections.reduce((total, s) =>
      total + s.content.filter((_, i) => isDue(s.id, i)).length, 0
    );
  }

  // Réinitialise toutes les données SRS
  function resetSRS() {
    setSrsData({});
  }

  return { getCard, review, isDue, dueCount, resetSRS };
}