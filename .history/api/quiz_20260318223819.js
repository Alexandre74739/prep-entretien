// api/quiz.js  →  route : /api/quiz
//
// GET  /api/quiz?section=  → QCM d'une section
// POST /api/quiz           → créer un QCM

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET ────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { section } = req.query;
    let query = supabase.from("quiz_items").select("*");
    if (section) query = query.eq("section_id", section);

    const { data, error } = await query.order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });

    // Reformate pour le front-end : options[] au lieu de option_a/b/c/d
    const formatted = data.map((item) => ({
      id:          item.id,
      section_id:  item.section_id,
      question:    item.question,
      options:     [item.option_a, item.option_b, item.option_c, item.option_d],
      answer:      item.correct,
      explanation: item.explanation,
      custom:      true,
    }));

    return res.status(200).json(formatted);
  }

  // ── POST ───────────────────────────────────────────────────
  if (req.method === "POST") {
    const { section_id, question, options, answer, explanation } = req.body;

    if (!section_id || !question || !options || options.length !== 4) {
      return res.status(400).json({ error: "Données incomplètes" });
    }

    const { data, error } = await supabase
      .from("quiz_items")
      .insert({
        section_id,
        question,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        correct:  answer,
        explanation: explanation || "",
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, id: data.id });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}