// src/hooks/useSRS.js — Intervalles courts (max 7 jours)

import { useLocalStorage } from "./useLocalStorage";

export function cardKey(sectionId, questionIndex) {
  return `${sectionId}__${questionIndex}`;
}

// Intervalles resserrés :
// Difficile → revoir dans 1h (même jour)
// Bien      → revoir dans 1 jour
// Facile    → revoir dans 2-3 jours max
function calcNext(card, rating) {
  let { interval, ease, repetitions } = card;

  if (rating === 1) {
    // Difficile : revoir aujourd'hui / demain
    repetitions = 0;
    interval    = 0; // 0 = aujourd'hui encore
  } else if (rating === 2) {
    // Bien
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 2;
    else interval = Math.min(Math.round(interval * 1.5), 5); // max 5 jours
    repetitions += 1;
    ease = Math.max(1.3, ease);
  } else {
    // Facile
    if (repetitions === 0) interval = 2;
    else if (repetitions === 1) interval = 3;
    else interval = Math.min(Math.round(interval * ease), 7); // max 7 jours
    repetitions += 1;
    ease = Math.min(2.2, ease + 0.1);
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

  function getCard(sectionId, questionIndex) {
    const key = cardKey(sectionId, questionIndex);
    return srsData[key] ?? {
      interval: 0, ease: 2.5, repetitions: 0,
      nextReview: null, lastReview: null,
    };
  }

  function review(sectionId, questionIndex, rating) {
    const key  = cardKey(sectionId, questionIndex);
    const card = getCard(sectionId, questionIndex);
    setSrsData((prev) => ({ ...prev, [key]: calcNext(card, rating) }));
  }

  function isDue(sectionId, questionIndex) {
    const card = getCard(sectionId, questionIndex);
    if (!card.nextReview) return true;
    return card.nextReview <= new Date().toISOString().split("T")[0];
  }

  function dueCount(sections) {
    return sections.reduce((total, s) =>
      total + s.content.filter((_, i) => isDue(s.id, i)).length, 0
    );
  }

  function resetSRS() { setSrsData({}); }

  return { getCard, review, isDue, dueCount, resetSRS };
}