# PrepCode

> Application web de préparation aux entretiens techniques — Bachelor 3 / Alternance

**PrepCode** est une Progressive Web App (PWA) conçue pour réviser efficacement les notions clés du développement web. Elle centralise fiches de cours, quiz adaptatifs et simulation d'entretien dans une interface moderne, installable et fonctionnelle hors ligne.

---

## Fonctionnalités

### Révision
- **Fiches de cours** — lecture et navigation par section
- **Révision rapide** — cartes flash à révéler au clic, parcours à son rythme
- **Quiz classique** — 5 questions QCM aléatoires avec score et correction détaillée

### Quiz adaptatif
- **Répétition espacée** (algorithme SM-2) — priorise les questions les moins maîtrisées
- Score et feedback détaillé après chaque session
- Historique de progression sauvegardé localement (localStorage)

### Simulation d'entretien
- **Quiz Entretien** — 10 questions tirées aléatoirement parmi toutes les sections
- Correction complète avec section d'origine de chaque question
- Résultat chiffré et jauge de performance

### Gestion du contenu
- **Ajout de questions** via formulaire — réponse textuelle + QCM optionnel + explication
- **Sauvegarde dans Supabase** — visible sur tous les appareils
- **Prompt IA intégré** — modèle prêt à copier pour générer des questions via ChatGPT / Claude

### Expérience utilisateur
- Navigation par bottom bar (Accueil · Sections · Quiz · Ajouter)
- Mode sombre / clair — palette violet / blanc (`#A89BF2`)
- **PWA** — installable sur mobile et desktop, fonctionnement hors ligne
- Logos officiels des technologies via [Devicon](https://devicon.dev/)
- Responsive, pensé mobile-first

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React 19 + Vite 8 |
| Styles | SCSS (Sass partials, BEM, CSS custom properties, `clamp()`) |
| Base de données | Supabase (PostgreSQL + client JS) |
| Icônes langages | Devicon (CDN) |
| Icônes UI | SVG custom (stroke, `currentColor`) |
| PWA | vite-plugin-pwa + Workbox |
| Algorithme quiz | SM-2 (répétition espacée) |

---

## Pré-requis

- **Node.js** ≥ 18
- **Compte Supabase** (gratuit sur [supabase.com](https://supabase.com))

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-user/prep-entretien.git
cd prep-entretien

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

---

## Configuration Supabase

Créer les deux tables suivantes dans votre projet Supabase :

```sql
-- Sections personnalisées
CREATE TABLE sections (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  icon       TEXT NOT NULL,           -- classe Devicon, ex: "devicon-react-original colored"
  color      TEXT DEFAULT '#A89BF2',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions (cours + QCM optionnel)
CREATE TABLE questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT REFERENCES sections(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  custom     BOOLEAN DEFAULT TRUE,
  quiz       JSONB,                   -- null si pas de QCM associé
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> Pour un usage personnel, désactiver RLS ou créer des politiques permissives avec la clé `anon`.

---

## Variables d'environnement

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Démarrage

```bash
npm run dev      # Serveur de développement → http://localhost:5173
npm run build    # Build de production → dist/
npm run preview  # Prévisualisation du build local
```

---

## Architecture

```
src/
├── components/
│   ├── Add/           # AddForm — ajout de questions et sections
│   ├── Cours/         # CoursList — affichage des fiches de cours
│   ├── Home/          # HomeScreen (dashboard), SectionsList
│   ├── Layout/        # Topbar, BottomNav, SplashScreen, InstallBanner
│   ├── Quiz/          # QuizPanel (3 modes), InterviewQuiz
│   └── ui/
│       └── Icon.jsx   # Icônes SVG (IconHome, IconMic, IconZap…)
│
├── context/
│   └── AppContext.jsx  # État global : sections, questions, thème, client Supabase
│
├── data/
│   └── sections.js    # Sections statiques par défaut (HTML, JS, React, SQL, Git, Docker)
│
├── hooks/
│   └── useSRS.js      # Algorithme SM-2 (répétition espacée), localStorage
│
├── lib/
│   └── supabase.js    # Initialisation du client Supabase
│
└── styles/
    ├── abstracts/     # _variables.scss, _mixins.scss
    ├── base/          # _reset.scss, _typography.scss, _animations.scss
    ├── components/    # _quiz.scss, _cours.scss, _forms.scss, _home.scss…
    └── layout/        # _app.scss, _topbar.scss, _bottom-nav.scss
```

### Flux de données

```
sections.js (statique)  +  Supabase (custom)
              │
              ▼
         AppContext
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
HomeScreen  QuizPanel  AddForm
```

---

## Sections incluses par défaut

| Section | Contenu | Icône |
|---|---|---|
| HTML / CSS | Fondamentaux web, flexbox, grid, animations | Devicon HTML5 |
| JavaScript / TypeScript | ES6+, async/await, types, closures | Devicon JavaScript |
| React | Hooks, state, context, lifecycle | Devicon React |
| SQL / BDD | SELECT, JOIN, index, transactions | Devicon PostgreSQL |
| Git / GitHub | Commits, branches, merge, rebase | Devicon Git |
| Docker / PHP | Images, conteneurs, volumes, compose | Devicon Docker |

---

## Algorithme de répétition espacée (SM-2)

Le mode **Quiz adaptatif** utilise une variante simplifiée de SM-2 :

- Chaque question possède un score `ease` (facilité) et un compteur `repetitions`
- **Bonne réponse** → facilité augmente, question déprioritisée
- **Mauvaise réponse** → question remontée dans la file de révision
- Les données sont persistées dans le `localStorage` du navigateur

---

## Licence

[MIT](LICENSE)

---

<p align="center">
  Fait avec React · Supabase · Vite · SCSS
</p>
