// ─────────────────────────────────────────────────────────────
// api/questions/[id].js  →  route : /api/questions/:id
//
// PUT    /api/questions/:id  → modifier une question
// DELETE /api/questions/:id  → supprimer une question
//
// [id] = syntaxe Vercel pour les paramètres dynamiques dans l'URL
// Accessible via req.query.id
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  // ── PUT : modifier ─────────────────────────────────────────
  if (req.method === "PUT") {
    const { question, answer } = req.body;
    const updates = {};
    if (question) updates.question = question;
    if (answer)   updates.answer   = answer;

    const { error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // ── DELETE : supprimer ─────────────────────────────────────
  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}