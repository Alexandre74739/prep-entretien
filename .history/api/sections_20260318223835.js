// api/sections.js  →  route : /api/sections
//
// GET  /api/sections  → toutes les sections custom
// POST /api/sections  → créer une section

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

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("custom_sections")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { id, label, icon, color } = req.body;
    if (!id || !label) {
      return res.status(400).json({ error: "id et label sont obligatoires" });
    }

    const { error } = await supabase
      .from("custom_sections")
      .insert({ id, label, icon: icon || "📝", color: color || "#f472b6" });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, id });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}