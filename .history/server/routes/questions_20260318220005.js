// ─────────────────────────────────────────────────────────────
// server/routes/questions.js
//
// Toutes les routes (endpoints) de l'API.
//
// Une route = une URL + une méthode HTTP :
//   GET    → lire des données
//   POST   → créer des données
//   PUT    → modifier des données
//   DELETE → supprimer des données
//
// Exemple : GET /api/questions/htmlcss
//           → retourne toutes les questions de la section htmlcss
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const db = require("../db");

// ════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════

// GET /api/sections
// Retourne toutes les sections custom créées par l'utilisateur
router.get("/sections", (req, res) => {
  const sections = db
    .prepare("SELECT * FROM sections WHERE is_custom = 1 ORDER BY created_at ASC")
    .all();
  res.json(sections);
});

// POST /api/sections
// Crée une nouvelle section
// Body attendu : { id, label, icon, color }
router.post("/sections", (req, res) => {
  const { id, label, icon, color } = req.body;

  // Validation basique
  if (!id || !label) {
    return res.status(400).json({ error: "id et label sont obligatoires" });
  }

  try {
    db.prepare(
      "INSERT INTO sections (id, label, icon, color, is_custom) VALUES (?, ?, ?, ?, 1)"
    ).run(id, label, icon || "📝", color || "#f472b6");

    res.status(201).json({ success: true, id });
  } catch (e) {
    // Cas où l'ID existe déjà (UNIQUE constraint)
    res.status(409).json({ error: "Cette section existe déjà" });
  }
});

// DELETE /api/sections/:id
// Supprime une section et toutes ses questions (CASCADE)
router.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM sections WHERE id = ? AND is_custom = 1").run(id);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// QUESTIONS (cours)
// ════════════════════════════════════════════════════════════

// GET /api/questions/:sectionId
// Retourne toutes les questions custom d'une section
router.get("/questions/:sectionId", (req, res) => {
  const questions = db
    .prepare(
      "SELECT * FROM questions WHERE section_id = ? AND is_custom = 1 ORDER BY created_at ASC"
    )
    .all(req.params.sectionId);
  res.json(questions);
});

// GET /api/questions
// Retourne TOUTES les questions custom (toutes sections confondues)
router.get("/questions", (req, res) => {
  const questions = db
    .prepare("SELECT * FROM questions WHERE is_custom = 1 ORDER BY section_id, created_at ASC")
    .all();
  res.json(questions);
});

// POST /api/questions
// Ajoute une nouvelle question
// Body attendu : { section_id, question, answer }
router.post("/questions", (req, res) => {
  const { section_id, question, answer } = req.body;

  if (!section_id || !question || !answer) {
    return res.status(400).json({ error: "section_id, question et answer sont obligatoires" });
  }

  const result = db
    .prepare("INSERT INTO questions (section_id, question, answer) VALUES (?, ?, ?)")
    .run(section_id, question, answer);

  // result.lastInsertRowid = l'ID auto-généré par SQLite
  res.status(201).json({ success: true, id: result.lastInsertRowid });
});

// PUT /api/questions/:id
// Modifie une question existante
// Body attendu : { question?, answer? } (les deux sont optionnels)
router.put("/questions/:id", (req, res) => {
  const { question, answer } = req.body;
  const { id } = req.params;

  // On met à jour seulement les champs fournis
  if (question) {
    db.prepare("UPDATE questions SET question = ? WHERE id = ?").run(question, id);
  }
  if (answer) {
    db.prepare("UPDATE questions SET answer = ? WHERE id = ?").run(answer, id);
  }

  res.json({ success: true });
});

// DELETE /api/questions/:id
// Supprime une question
router.delete("/questions/:id", (req, res) => {
  db.prepare("DELETE FROM questions WHERE id = ? AND is_custom = 1").run(req.params.id);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// QUIZ ITEMS
// ════════════════════════════════════════════════════════════

// GET /api/quiz/:sectionId
// Retourne les QCM custom d'une section
router.get("/quiz/:sectionId", (req, res) => {
  const items = db
    .prepare(
      "SELECT * FROM quiz_items WHERE section_id = ? AND is_custom = 1 ORDER BY created_at ASC"
    )
    .all(req.params.sectionId);

  // On reconstruit le tableau options[] pour le front-end
  const formatted = items.map((item) => ({
    id: item.id,
    section_id: item.section_id,
    question: item.question,
    options: [item.option_a, item.option_b, item.option_c, item.option_d],
    answer: item.correct,
    explanation: item.explanation,
    custom: true,
  }));

  res.json(formatted);
});

// POST /api/quiz
// Ajoute un QCM
// Body attendu : { section_id, question, options: [A,B,C,D], answer, explanation }
router.post("/quiz", (req, res) => {
  const { section_id, question, options, answer, explanation } = req.body;

  if (!section_id || !question || !options || options.length !== 4) {
    return res.status(400).json({ error: "Données incomplètes" });
  }

  const result = db
    .prepare(
      `INSERT INTO quiz_items
       (section_id, question, option_a, option_b, option_c, option_d, correct, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      section_id,
      question,
      options[0], options[1], options[2], options[3],
      answer,
      explanation || ""
    );

  res.status(201).json({ success: true, id: result.lastInsertRowid });
});

// PUT /api/quiz/:id
// Modifie un QCM existant
router.put("/quiz/:id", (req, res) => {
  const { question, options, answer, explanation } = req.body;
  const { id } = req.params;

  if (question) db.prepare("UPDATE quiz_items SET question = ? WHERE id = ?").run(question, id);
  if (options?.length === 4) {
    db.prepare(
      "UPDATE quiz_items SET option_a=?, option_b=?, option_c=?, option_d=? WHERE id=?"
    ).run(options[0], options[1], options[2], options[3], id);
  }
  if (answer !== undefined) db.prepare("UPDATE quiz_items SET correct = ? WHERE id = ?").run(answer, id);
  if (explanation) db.prepare("UPDATE quiz_items SET explanation = ? WHERE id = ?").run(explanation, id);

  res.json({ success: true });
});

// DELETE /api/quiz/:id
router.delete("/quiz/:id", (req, res) => {
  db.prepare("DELETE FROM quiz_items WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;