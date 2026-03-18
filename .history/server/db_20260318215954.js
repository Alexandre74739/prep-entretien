// ─────────────────────────────────────────────────────────────
// server/db.js
//
// Connexion à la base de données SQLite.
//
// better-sqlite3 est une librairie qui permet de lire/écrire
// dans un fichier .db (ta base de données).
//
// SQLite = une BDD complète dans un seul fichier.
// Pas besoin d'installer MySQL ou PostgreSQL pour débuter.
// ─────────────────────────────────────────────────────────────

const Database = require("better-sqlite3");
const path = require("path");

// Le fichier data.db sera créé automatiquement s'il n'existe pas
const db = new Database(path.join(__dirname, "data.db"));

// ── Création des tables si elles n'existent pas ───────────────
// "IF NOT EXISTS" = on ne recrée pas la table si elle existe déjà
// C'est important : ce code s'exécute à chaque démarrage du serveur

db.exec(`
  -- Table des sections (htmlcss, js, react, etc.)
  CREATE TABLE IF NOT EXISTS sections (
    id        TEXT PRIMARY KEY,   -- ex: "htmlcss", "custom_1234"
    label     TEXT NOT NULL,      -- ex: "HTML / CSS"
    icon      TEXT NOT NULL,      -- ex: "🎨"
    color     TEXT NOT NULL,      -- ex: "#f97316"
    is_custom INTEGER DEFAULT 0,  -- 0 = section de base, 1 = ajoutée par l'utilisateur
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Table des questions (cours)
  CREATE TABLE IF NOT EXISTS questions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id TEXT NOT NULL,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    is_custom  INTEGER DEFAULT 1,  -- 1 = ajoutée par l'utilisateur
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  -- Table des questions de quiz (QCM)
  CREATE TABLE IF NOT EXISTS quiz_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id  TEXT NOT NULL,
    question    TEXT NOT NULL,
    option_a    TEXT NOT NULL,
    option_b    TEXT NOT NULL,
    option_c    TEXT NOT NULL,
    option_d    TEXT NOT NULL,
    correct     INTEGER NOT NULL,  -- index de la bonne réponse (0, 1, 2 ou 3)
    explanation TEXT,
    is_custom   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );
`);

console.log("✅ Base de données prête : data.db");

module.exports = db;