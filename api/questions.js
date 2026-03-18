// ─────────────────────────────────────────────────────────────
// api/questions.js  →  route : /api/questions
//
// Vercel Serverless Function.
// Ce fichier remplace server/routes/questions.js + server/index.js
//
// GET  /api/questions          → toutes les questions custom
// GET  /api/questions?section= → questions d'une section
// POST /api/questions          → créer une question
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

// Les variables d'environnement sont définies dans .env (local)
// et dans Vercel Dashboard (production)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS : autorise le front-end à appeler cette fonction
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight OPTIONS (envoyé automatiquement par le navigateur)
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET ────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { section } = req.query;

    let query = supabase.from("questions").select("*").eq("is_custom", true);

    // Filtre optionnel par section
    if (section) query = query.eq("section_id", section);

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── POST ───────────────────────────────────────────────────
  if (req.method === "POST") {
    const { section_id, question, answer } = req.body;

    if (!section_id || !question || !answer) {
      return res.status(400).json({ error: "section_id, question et answer sont obligatoires" });
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({ section_id, question, answer })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, id: data.id });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}