// ─────────────────────────────────────────────────────────────
// server/routes/questions.js
//
// Routes API — version JSON file (sans SQLite).
// Même structure qu'avant, on lit/écrit dans data.json.
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { readDB, writeDB, nextId } = require("../db");

// ════════════════════════════════════════════════════════════
// SECTIONS CUSTOM
// ════════════════════════════════════════════════════════════

// GET /api/sections — retourne toutes les sections custom
router.get("/sections", (req, res) => {
  const db = readDB();
  res.json(db.custom_sections);
});

// POST /api/sections — crée une section
router.post("/sections", (req, res) => {
  const { id, label, icon, color } = req.body;
  if (!id || !label) {
    return res.status(400).json({ error: "id et label sont obligatoires" });
  }

  const db = readDB();

  if (db.custom_sections.find((s) => s.id === id)) {
    return res.status(409).json({ error: "Cette section existe déjà" });
  }

  db.custom_sections.push({ id, label, icon: icon || "📝", color: color || "#f472b6" });
  writeDB(db);

  res.status(201).json({ success: true, id });
});

// DELETE /api/sections/:id — supprime une section et ses questions
router.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  db.custom_sections = db.custom_sections.filter((s) => s.id !== id);
  db.questions       = db.questions.filter((q) => q.section_id !== id);
  db.quiz_items      = db.quiz_items.filter((q) => q.section_id !== id);
  writeDB(db);

  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// QUESTIONS (cours)
// ════════════════════════════════════════════════════════════

// GET /api/questions — toutes les questions custom
router.get("/questions", (req, res) => {
  const db = readDB();
  res.json(db.questions);
});

// GET /api/questions/:sectionId — questions d'une section
router.get("/questions/:sectionId", (req, res) => {
  const db = readDB();
  res.json(db.questions.filter((q) => q.section_id === req.params.sectionId));
});

// POST /api/questions — ajoute une question
// Body : { section_id, question, answer }
router.post("/questions", (req, res) => {
  const { section_id, question, answer } = req.body;
  if (!section_id || !question || !answer) {
    return res.status(400).json({ error: "section_id, question et answer sont obligatoires" });
  }

  const db  = readDB();
  const newQ = {
    id:         nextId(db.questions),
    section_id,
    question,
    answer,
    is_custom:  true,
    created_at: new Date().toISOString(),
  };

  db.questions.push(newQ);
  writeDB(db);

  res.status(201).json({ success: true, id: newQ.id });
});

// PUT /api/questions/:id — modifie une question
router.put("/questions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { question, answer } = req.body;

  const db = readDB();
  const idx = db.questions.findIndex((q) => q.id === id);

  if (idx === -1) return res.status(404).json({ error: "Question introuvable" });

  if (question) db.questions[idx].question = question;
  if (answer)   db.questions[idx].answer   = answer;
  writeDB(db);

  res.json({ success: true });
});

// DELETE /api/questions/:id — supprime une question
router.delete("/questions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();

  db.questions = db.questions.filter((q) => q.id !== id);
  writeDB(db);

  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// QUIZ ITEMS (QCM)
// ════════════════════════════════════════════════════════════

// GET /api/quiz/:sectionId — QCM d'une section
router.get("/quiz/:sectionId", (req, res) => {
  const db    = readDB();
  const items = db.quiz_items.filter((q) => q.section_id === req.params.sectionId);

  // Reformate pour le front-end (options[] au lieu de option_a/b/c/d)
  const formatted = items.map((item) => ({
    id:          item.id,
    section_id:  item.section_id,
    question:    item.question,
    options:     [item.option_a, item.option_b, item.option_c, item.option_d],
    answer:      item.correct,
    explanation: item.explanation,
    custom:      true,
  }));

  res.json(formatted);
});

// POST /api/quiz — ajoute un QCM
// Body : { section_id, question, options: [A,B,C,D], answer, explanation }
router.post("/quiz", (req, res) => {
  const { section_id, question, options, answer, explanation } = req.body;

  if (!section_id || !question || !options || options.length !== 4) {
    return res.status(400).json({ error: "Données incomplètes" });
  }

  const db  = readDB();
  const newItem = {
    id:          nextId(db.quiz_items),
    section_id,
    question,
    option_a:    options[0],
    option_b:    options[1],
    option_c:    options[2],
    option_d:    options[3],
    correct:     answer,
    explanation: explanation || "",
    is_custom:   true,
    created_at:  new Date().toISOString(),
  };

  db.quiz_items.push(newItem);
  writeDB(db);

  res.status(201).json({ success: true, id: newItem.id });
});

// PUT /api/quiz/:id — modifie un QCM
router.put("/quiz/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { question, options, answer, explanation } = req.body;
  const db  = readDB();
  const idx = db.quiz_items.findIndex((q) => q.id === id);

  if (idx === -1) return res.status(404).json({ error: "Quiz introuvable" });

  if (question)          db.quiz_items[idx].question    = question;
  if (options?.length === 4) {
    db.quiz_items[idx].option_a = options[0];
    db.quiz_items[idx].option_b = options[1];
    db.quiz_items[idx].option_c = options[2];
    db.quiz_items[idx].option_d = options[3];
  }
  if (answer !== undefined) db.quiz_items[idx].correct     = answer;
  if (explanation)          db.quiz_items[idx].explanation = explanation;
  writeDB(db);

  res.json({ success: true });
});

// DELETE /api/quiz/:id
router.delete("/quiz/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();

  db.quiz_items = db.quiz_items.filter((q) => q.id !== id);
  writeDB(db);

  res.json({ success: true });
});

module.exports = router;