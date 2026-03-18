// api/quiz/[id].js  →  route : /api/quiz/:id
//
// PUT    /api/quiz/:id  → modifier un QCM
// DELETE /api/quiz/:id  → supprimer un QCM

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

  if (req.method === "PUT") {
    const { question, options, answer, explanation } = req.body;
    const updates = {};
    if (question)           updates.question    = question;
    if (options?.length === 4) {
      updates.option_a = options[0];
      updates.option_b = options[1];
      updates.option_c = options[2];
      updates.option_d = options[3];
    }
    if (answer !== undefined) updates.correct     = answer;
    if (explanation)          updates.explanation = explanation;

    const { error } = await supabase.from("quiz_items").update(updates).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("quiz_items").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}