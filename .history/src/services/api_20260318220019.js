// ─────────────────────────────────────────────────────────────
// client/src/services/api.js
//
// Toutes les fonctions qui appellent l'API Node.js.
// Les composants React n'appellent jamais fetch() directement :
// ils passent par ces fonctions.
//
// Avantage : si l'URL de l'API change, on ne modifie qu'ici.
// ─────────────────────────────────────────────────────────────

const API_URL = "http://localhost:3001/api";

// ── Utilitaire interne ────────────────────────────────────────
async function request(method, path, body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
  return res.json();
}

// ════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════

export const sectionsApi = {
  // Récupère toutes les sections custom
  getAll: () => request("GET", "/sections"),

  // Crée une nouvelle section
  create: ({ id, label, icon, color }) =>
    request("POST", "/sections", { id, label, icon, color }),

  // Supprime une section
  delete: (id) => request("DELETE", `/sections/${id}`),
};

// ════════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════════

export const questionsApi = {
  // Récupère les questions d'une section
  getBySection: (sectionId) => request("GET", `/questions/${sectionId}`),

  // Récupère toutes les questions (toutes sections)
  getAll: () => request("GET", "/questions"),

  // Ajoute une question
  create: ({ sectionId, question, answer }) =>
    request("POST", "/questions", {
      section_id: sectionId,
      question,
      answer,
    }),

  // Modifie une question
  update: (id, { question, answer }) =>
    request("PUT", `/questions/${id}`, { question, answer }),

  // Supprime une question
  delete: (id) => request("DELETE", `/questions/${id}`),
};

// ════════════════════════════════════════════════════════════
// QUIZ
// ════════════════════════════════════════════════════════════

export const quizApi = {
  // Récupère les QCM d'une section
  getBySection: (sectionId) => request("GET", `/quiz/${sectionId}`),

  // Ajoute un QCM
  create: ({ sectionId, question, options, answer, explanation }) =>
    request("POST", "/quiz", {
      section_id: sectionId,
      question,
      options,
      answer,
      explanation,
    }),

  // Modifie un QCM
  update: (id, data) => request("PUT", `/quiz/${id}`, data),

  // Supprime un QCM
  delete: (id) => request("DELETE", `/quiz/${id}`),
};