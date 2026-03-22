// ─────────────────────────────────────────────────────────────
// src/services/api.js
//
// Connexion directe à Supabase depuis le frontend.
// Fonctionne en local (vite dev) ET en production sans serveur.
// ─────────────────────────────────────────────────────────────

import { supabase } from "../lib/supabase";

// ── Sections custom ────────────────────────────────────────────
export const sectionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("custom_sections")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async create({ id, label, icon, color }) {
    const { error } = await supabase
      .from("custom_sections")
      .insert({ id, label, icon, color });
    if (error) throw new Error(error.message);
    return { id };
  },

  async delete(id) {
    const { error } = await supabase
      .from("custom_sections")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};

// ── Questions (cours) ──────────────────────────────────────────
export const questionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("is_custom", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getBySection(sectionId) {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("is_custom", true)
      .eq("section_id", sectionId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async create({ sectionId, question, answer }) {
    const { data, error } = await supabase
      .from("questions")
      .insert({ section_id: sectionId, question, answer })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id };
  },

  async update(id, { question, answer }) {
    const { error } = await supabase
      .from("questions")
      .update({ question, answer })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async delete(id) {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};

// ── Quiz items (QCM) ───────────────────────────────────────────
export const quizApi = {
  async getBySection(sectionId) {
    const { data, error } = await supabase
      .from("quiz_items")
      .select("*")
      .eq("section_id", sectionId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    // Reformater les colonnes option_a/b/c/d en tableau
    return (data ?? []).map((row) => ({
      id:          row.id,
      section_id:  row.section_id,
      question:    row.question,
      options:     [row.option_a, row.option_b, row.option_c, row.option_d],
      answer:      row.answer,
      explanation: row.explanation,
    }));
  },

  async create({ sectionId, question, options, answer, explanation }) {
    const { data, error } = await supabase
      .from("quiz_items")
      .insert({
        section_id:  sectionId,
        question,
        option_a:    options[0],
        option_b:    options[1],
        option_c:    options[2],
        option_d:    options[3],
        answer,
        explanation,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id };
  },

  async update(id, { question, options, answer, explanation }) {
    const { error } = await supabase
      .from("quiz_items")
      .update({
        question,
        option_a:    options[0],
        option_b:    options[1],
        option_c:    options[2],
        option_d:    options[3],
        answer,
        explanation,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async delete(id) {
    const { error } = await supabase
      .from("quiz_items")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};
