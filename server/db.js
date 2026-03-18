// ─────────────────────────────────────────────────────────────
// server/db.js
//
// Base de données = un simple fichier JSON (data.json).
// On utilise le module "fs" intégré à Node.js (pas besoin
// d'installer quoi que ce soit).
//
// Structure du fichier data.json :
// {
//   "questions": [
//     { "id": 1, "section_id": "htmlcss", "question": "...", "answer": "...", "is_custom": true }
//   ],
//   "quiz_items": [ ... ],
//   "custom_sections": [ ... ]
// }
// ─────────────────────────────────────────────────────────────

const fs   = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "data.json");

// Structure vide par défaut (créée si le fichier n'existe pas)
const EMPTY = {
  questions:       [],
  quiz_items:      [],
  custom_sections: [],
};

// ── Lire toute la base ────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(FILE)) return EMPTY;
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return EMPTY;
  }
}

// ── Écrire toute la base ──────────────────────────────────────
// JSON.stringify(data, null, 2) = JSON indenté (lisible par un humain)
function writeDB(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Génère un ID numérique unique ─────────────────────────────
function nextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

console.log("✅ Base de données JSON prête :", FILE);

module.exports = { readDB, writeDB, nextId };