// src/services/api.js
//
// URL relative "/api" : fonctionne en local (vercel dev)
// ET en production (vercel.app) sans rien changer.

const API_URL = "/api";

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

export const sectionsApi = {
  getAll:  ()              => request("GET",    "/sections"),
  create:  (data)          => request("POST",   "/sections", data),
  delete:  (id)            => request("DELETE", `/sections/${id}`),
};

export const questionsApi = {
  getAll:       ()         => request("GET",    "/questions"),
  getBySection: (sectionId)=> request("GET",    `/questions?section=${sectionId}`),
  create:       (data)     => request("POST",   "/questions", {
    section_id: data.sectionId,
    question:   data.question,
    answer:     data.answer,
  }),
  update: (id, data)       => request("PUT",    `/questions/${id}`, data),
  delete: (id)             => request("DELETE", `/questions/${id}`),
};

export const quizApi = {
  getBySection: (sectionId) => request("GET",  `/quiz?section=${sectionId}`),
  create:       (data)      => request("POST", "/quiz", {
    section_id:  data.sectionId,
    question:    data.question,
    options:     data.options,
    answer:      data.answer,
    explanation: data.explanation,
  }),
  update: (id, data)        => request("PUT",    `/quiz/${id}`, data),
  delete: (id)              => request("DELETE", `/quiz/${id}`),
};