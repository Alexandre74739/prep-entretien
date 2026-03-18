// ─────────────────────────────────────────────────────────────
// src/data/sections.js
// Données de base (ne jamais modifier manuellement).
// Les questions ajoutées par l'utilisateur sont gérées dans
// le contexte et sauvegardées séparément dans localStorage.
// ─────────────────────────────────────────────────────────────

export const BASE_SECTIONS = [
  {
    id: "htmlcss",
    label: "HTML / CSS",
    icon: "🎨",
    color: "#f97316",
    content: [
      {
        q: "Différences entre position: static, relative, absolute, fixed, sticky",
        a: `static → flux normal, top/left sans effet.

relative → reste dans le flux, décalé par rapport à sa position normale. Crée un contexte de positionnement pour ses enfants absolus.

absolute → sorti du flux. Se positionne par rapport à son ancêtre positionné le plus proche. S'il n'en a pas → par rapport au <html>.

fixed → sorti du flux. Ancré sur le viewport. Reste visible au scroll.

sticky → hybride : relatif jusqu'à un seuil de scroll (top: Xpx), puis se fixe comme fixed.

⚠️ Piège : un absolute cherche un ancêtre avec position !== static.`,
      },
      {
        q: "Différences entre Flexbox et CSS Grid",
        a: `Flexbox → 1D (une direction : row ou column). Pour aligner des items dans une ligne ou colonne.

Grid → 2D (lignes ET colonnes). Pour des layouts de page complets.

Règle simple :
→ Aligner des items dans un composant = Flexbox
→ Structure globale de la page = Grid

⚠️ justify-content = axe principal | align-items = axe transversal`,
      },
      {
        q: "Qu'est-ce que la spécificité CSS ?",
        a: `La cascade détermine quelle règle "gagne" quand plusieurs s'appliquent.

Ordre (du + fort au - fort) :
1. !important (à éviter)
2. style inline
3. ID → #id          (1-0-0)
4. Class / :hover    (0-1-0)
5. Élément → div     (0-0-1)

Exemple : #nav .link:hover = 1-1-1 bat .link (0-1-0)`,
      },
      {
        q: "Qu'est-ce que le Box Model ?",
        a: `Tout élément HTML est une boîte : content → padding → border → margin

box-sizing: content-box (défaut)
→ width = contenu uniquement. Padding et border s'ajoutent.

box-sizing: border-box (recommandé)
→ width inclut padding + border.

Reset standard :
*, *::before, *::after { box-sizing: border-box; }`,
      },
    ],
    quiz: [
      {
        question: "Un élément position:absolute se positionne par rapport à :",
        options: [
          "Toujours le viewport",
          "Son ancêtre positionné (position !== static) le plus proche",
          "Toujours le <body>",
          "Son parent direct",
        ],
        answer: 1,
        explanation:
          "Il remonte le DOM jusqu'à trouver un ancêtre positionné. S'il n'en trouve pas, il se positionne par rapport au <html>.",
      },
      {
        question: "Quelle valeur de position reste visible en scrollant ?",
        options: ["relative", "absolute", "sticky", "fixed"],
        answer: 3,
        explanation: "fixed est ancré sur le viewport, indépendamment du scroll.",
      },
      {
        question:
          "Avec box-sizing: content-box, un div width:200px + padding:20px a une largeur totale de :",
        options: ["200px", "220px", "240px", "180px"],
        answer: 2,
        explanation: "Largeur réelle = 200 + 20 (gauche) + 20 (droite) = 240px.",
      },
      {
        question: "Pour un layout header + sidebar + contenu, la meilleure approche est :",
        options: ["Flexbox uniquement", "CSS Grid", "position absolute partout", "Float"],
        answer: 1,
        explanation: "Grid est fait pour les layouts 2D avec lignes et colonnes simultanées.",
      },
      {
        question: "Quelle règle a la plus haute spécificité ?",
        options: [".nav li a:hover", "#header .nav a", "div > ul > li > a", "body div span"],
        answer: 1,
        explanation: "#header .nav a = 1 ID + 1 class + 1 element = 1-1-1. L'ID domine.",
      },
    ],
  },
  {
    id: "js",
    label: "JavaScript / TS",
    icon: "⚡",
    color: "#eab308",
    content: [
      {
        q: "Que font async, await, try et catch ?",
        a: `async → marque une fonction asynchrone. Retourne toujours une Promise.

await → met en pause l'exécution jusqu'à ce que la Promise se resolve.

try/catch → gestion d'erreurs. Si la Promise rejette, on tombe dans catch.

async function fetchUser(id) {
  try {
    const res = await fetch('/api/users/' + id);
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

⚠️ Sans try/catch, une Promise rejectée = UnhandledPromiseRejection.`,
      },
      {
        q: "Différences entre var, let et const",
        a: `var → portée fonctionnelle, hoistée, re-déclarable. À ne jamais utiliser.

let → portée de bloc ({}), peut être réassignée.

const → portée de bloc, ne peut pas être réassignée.
⚠️ Mais si c'est un objet/tableau, son contenu peut changer :

const user = { name: "A" };
user.name = "B"; // ✅ OK
user = {};       // ❌ Erreur

Règle : const par défaut, let si réassignation, jamais var.`,
      },
      {
        q: "TypeScript : interface vs type",
        a: `Les deux décrivent la forme d'un objet, mais :

interface → peut être étendue (extends) et fusionnée.
Préférée pour les objets et les contrats d'API.

type → plus flexible : unions, intersections, primitives, tuples.

type ID = string | number;          // impossible avec interface
type Admin = User & { role: "admin" }; // intersection

En pratique : interface pour les objets, type pour le reste.`,
      },
      {
        q: "Qu'est-ce qu'une closure (fermeture) ?",
        a: `Une closure = une fonction qui se souvient de son environnement
lexical après que la fonction parente a terminé.

function makeCounter() {
  let count = 0;
  return () => ++count; // "capture" count
}
const counter = makeCounter();
counter(); // 1
counter(); // 2

C'est la base de useState, useEffect et du module pattern.`,
      },
    ],
    quiz: [
      {
        question: "Que retourne une fonction async qui fait return 42 ?",
        options: ["Le nombre 42", "Promise.resolve(42)", "Promise.reject(42)", "undefined"],
        answer: 1,
        explanation: "Toute fonction async retourne implicitement une Promise.",
      },
      {
        question: "Que vaut typeof null ?",
        options: ["null", "undefined", "object", "string"],
        answer: 2,
        explanation: "Bug historique de JS. typeof null = 'object'. Pour tester null, utiliser === null.",
      },
      {
        question: "Différence entre == et === ?",
        options: [
          "Aucune",
          "=== compare valeur + type, == fait une coercition",
          "== est plus strict",
          "=== ne marche qu'avec les primitives",
        ],
        answer: 1,
        explanation: "'5' == 5 → true (coercition). '5' === 5 → false. Toujours utiliser ===.",
      },
      {
        question: "En TypeScript, unknown vs any ?",
        options: [
          "Identiques",
          "unknown force une vérification de type avant utilisation, any non",
          "any est plus restrictif",
          "unknown n'existe pas",
        ],
        answer: 1,
        explanation:
          "any désactive le contrôle de type. unknown oblige à vérifier (typeof, instanceof) avant d'utiliser.",
      },
      {
        question: "Quel est le résultat de [1,2,3].map(x => x * 2) ?",
        options: ["[1,2,3]", "[2,4,6]", "6", "undefined"],
        answer: 1,
        explanation: "map crée un nouveau tableau en appliquant la fonction à chaque élément.",
      },
    ],
  },
  {
    id: "react",
    label: "React",
    icon: "⚛️",
    color: "#38bdf8",
    content: [
      {
        q: "Différences entre hooks et props",
        a: `Props → communication parent → enfant. En lecture seule. Viennent de l'extérieur.

Hooks → fonctions spéciales (useXxx) qui gèrent la logique interne
(état, effets, contexte...).

function Button({ label, onClick }) { // ← props
  const [active, setActive] = useState(false); // ← hook
  return (
    <button onClick={() => { setActive(true); onClick(); }}>
      {label}
    </button>
  );
}

⚠️ Règle : hooks uniquement dans des composants fonctionnels,
jamais dans des conditions ou boucles.`,
      },
      {
        q: "useEffect : comment ça fonctionne ?",
        a: `useEffect exécute des effets de bord après le rendu.

useEffect(() => { /* effet */ }, [deps]);

[] vide       → s'exécute une fois au montage
[var]         → s'exécute quand var change
sans tableau  → s'exécute à chaque rendu (souvent un bug !)

Cleanup : le return nettoie avant relance ou démontage.
useEffect(() => {
  const sub = subscribe(id);
  return () => sub.unsubscribe(); // cleanup
}, [id]);

⚠️ Oublier une dépendance → données stale (périmées).`,
      },
      {
        q: "Qu'est-ce que le Virtual DOM ?",
        a: `Le DOM réel est lent à manipuler. React utilise un Virtual DOM
(représentation JS légère).

Processus (reconciliation) :
1. État change → React re-render → nouveau Virtual DOM
2. Diffing : compare ancien et nouveau Virtual DOM
3. Patching : applique uniquement les différences au DOM réel

React Fiber (depuis React 16) : moteur amélioré qui peut
prioriser et interrompre les mises à jour.`,
      },
      {
        q: "Context API vs Redux : quand utiliser quoi ?",
        a: `Context API → passer des données sans prop drilling.
Idéal pour : thème, langue, utilisateur connecté.

const ThemeCtx = createContext("light");
<ThemeCtx.Provider value="dark"><App /></ThemeCtx.Provider>
const theme = useContext(ThemeCtx); // n'importe où dans l'arbre

Redux → état complexe, fréquemment modifié, gros projet d'équipe,
besoin de devtools.

⚠️ Context avec données qui changent souvent
= re-renders inutiles de tous les abonnés.`,
      },
    ],
    quiz: [
      {
        question: "Pourquoi ne peut-on pas appeler un hook dans un if ?",
        options: [
          "On peut, c'est autorisé",
          "React suit les hooks par ordre d'appel, une condition changerait cet ordre",
          "Les hooks retournent undefined dans un if",
          "Le composant se démonte",
        ],
        answer: 1,
        explanation:
          "React identifie les hooks par leur ordre d'appel. Si cet ordre change entre deux rendus, React ne sait plus quel état correspond à quel hook.",
      },
      {
        question: "Différence entre useMemo et useCallback ?",
        options: [
          "Identiques",
          "useMemo mémoïse une valeur calculée, useCallback mémoïse une fonction",
          "Le contraire",
          "useMemo est pour les classes",
        ],
        answer: 1,
        explanation:
          "useMemo retourne le résultat d'un calcul mémoïsé. useCallback retourne une référence de fonction mémoïsée.",
      },
      {
        question: "Dans quels cas un composant React se re-render ?",
        options: [
          "Uniquement si ses props changent",
          "Uniquement si son state change",
          "Si ses props changent, son state change, ou son parent se re-render",
          "Uniquement avec forceUpdate()",
        ],
        answer: 2,
        explanation:
          "Par défaut : state change, props changent, ou parent re-render. React.memo évite les re-renders inutiles dus au parent.",
      },
      {
        question: "Quel hook pour accéder directement à un élément DOM ?",
        options: ["useState", "useEffect", "useRef", "useCallback"],
        answer: 2,
        explanation:
          "useRef retourne { current: ... } sans déclencher de re-render. On l'attache via ref={monRef}.",
      },
      {
        question: "Composant contrôlé vs non contrôlé ?",
        options: [
          "Contrôlé = classes, non contrôlé = fonctions",
          "Contrôlé = valeur liée au state React, non contrôlé = valeur gérée par le DOM",
          "Non contrôlé = sans props",
          "Contrôlé = sans useEffect",
        ],
        answer: 1,
        explanation:
          "Contrôlé : value={state} + onChange. Non contrôlé : on lit via useRef. Les formulaires contrôlés sont plus prévisibles.",
      },
    ],
  },
  {
    id: "sql",
    label: "SQL / BDD",
    icon: "🗄️",
    color: "#34d399",
    content: [
      {
        q: "Types de JOIN et leurs différences",
        a: `INNER JOIN → uniquement les lignes avec correspondance dans les deux tables.

LEFT JOIN  → toutes les lignes de gauche + correspondances de droite
             (NULL si absent).

RIGHT JOIN → inverse du LEFT JOIN.

FULL OUTER JOIN → toutes les lignes des deux tables, NULL si absent.

SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
-- Retourne tous les users, même sans commande

⚠️ INNER = intersection. LEFT = toutes les lignes de gauche.`,
      },
      {
        q: "Qu'est-ce qu'un index SQL ?",
        a: `Un index (B-Tree) accélère les recherches sur une colonne,
au coût d'espace disque et de ralentissement des écritures.

Sans index : full table scan (toutes les lignes parcourues).
Avec index  : accès direct, comme un index de livre.

Quand indexer ?
→ Colonnes dans WHERE, JOIN ON, ORDER BY
→ Colonnes avec forte cardinalité

CREATE INDEX idx_email ON users(email);

⚠️ Sur-indexer dégrade les INSERT / UPDATE / DELETE.`,
      },
      {
        q: "ACID : les 4 propriétés d'une transaction",
        a: `A - Atomicité  : tout ou rien. Échec → ROLLBACK complet.
C - Cohérence  : la BDD passe d'un état valide à un autre.
I - Isolation  : les transactions concurrentes ne s'interfèrent pas.
D - Durabilité : un COMMIT est persisté même en cas de panne.

BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Les deux ou aucun`,
      },
      {
        q: "SQL vs NoSQL : différences et cas d'usage",
        a: `SQL (MySQL, PostgreSQL) :
→ Schéma fixe, tables relationnelles
→ Transactions ACID
→ Idéal : e-commerce, banque, ERP

NoSQL (MongoDB, Redis, Cassandra) :
→ Schéma flexible
→ Scalabilité horizontale native
→ Idéal : logs temps réel, cache, big data

Pas de meilleur absolu : dépend du use case.`,
      },
    ],
    quiz: [
      {
        question: "Quelle requête retourne tous les users même sans commande ?",
        options: ["INNER JOIN", "LEFT JOIN orders", "RIGHT JOIN orders", "CROSS JOIN"],
        answer: 1,
        explanation:
          "LEFT JOIN retourne toutes les lignes de la table de gauche. Celles sans correspondance auront NULL.",
      },
      {
        question: "Différence entre WHERE et HAVING ?",
        options: [
          "Aucune",
          "WHERE filtre avant GROUP BY, HAVING filtre après l'agrégation",
          "HAVING fonctionne sans GROUP BY",
          "WHERE est pour les strings",
        ],
        answer: 1,
        explanation: "WHERE filtre les lignes individuelles. HAVING filtre les groupes (après GROUP BY).",
      },
      {
        question: "Qu'est-ce qu'une injection SQL ?",
        options: [
          "Insérer des emojis",
          "Attaque via entrée utilisateur — protection : requêtes préparées",
          "Méthode d'optimisation",
          "Bug MySQL uniquement",
        ],
        answer: 1,
        explanation: "Protection : TOUJOURS utiliser des requêtes préparées. Jamais concaténer une entrée utilisateur dans du SQL.",
      },
      {
        question: "Qu'est-ce qu'une PRIMARY KEY ?",
        options: [
          "Colonne avec doublons",
          "Identifiant unique + NOT NULL pour chaque ligne",
          "Clé qui pointe vers une autre table",
          "Contrainte sur les entiers uniquement",
        ],
        answer: 1,
        explanation: "PRIMARY KEY = UNIQUE + NOT NULL. Identifie de manière unique chaque enregistrement.",
      },
      {
        question: "L'opération la plus coûteuse sans index est :",
        options: [
          "INSERT",
          "SELECT avec WHERE sur colonne non indexée",
          "DELETE sur clé primaire",
          "UPDATE d'une seule ligne",
        ],
        answer: 1,
        explanation: "Sans index, un SELECT avec WHERE fait un full table scan : chaque ligne est examinée.",
      },
    ],
  },
  {
    id: "git",
    label: "Git / GitHub",
    icon: "🐙",
    color: "#a78bfa",
    content: [
      {
        q: "git merge vs git rebase",
        a: `merge → fusionne deux branches en créant un merge commit.
Préserve l'historique complet.

rebase → réapplique les commits de ta branche sur la pointe
d'une autre. Historique linéaire, mais réécrit l'historique.

# Merge
git checkout main && git merge feature/login

# Rebase
git checkout feature/login && git rebase main

⚠️ Règle d'or : ne JAMAIS rebase une branche publique/partagée.`,
      },
      {
        q: "Qu'est-ce qu'une Pull Request ?",
        a: `Une PR = demande de fusion d'une branche vers une autre.

Elle permet :
→ Code review par les pairs
→ Discussions et suggestions
→ Exécution automatique des tests (CI/CD)
→ Traçabilité des changements

Bonnes pratiques :
→ 1 PR = 1 feature ou 1 bugfix (petites PRs)
→ Bien décrire : quoi, pourquoi, comment tester
→ Au moins 1 reviewer
→ Ne jamais merger sa propre PR sans review`,
      },
      {
        q: "Qu'est-ce que CI/CD ? GitHub Actions ?",
        a: `CI (Continuous Integration) → à chaque push, tests automatiques
pour détecter les régressions.

CD (Continuous Deployment) → si les tests passent, déploiement auto.

GitHub Actions : automatisation en YAML.

on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm test

Mentionner CI/CD en entretien = culture DevOps et qualité.`,
      },
    ],
    quiz: [
      {
        question: "Annuler le dernier commit SANS perdre les modifications ?",
        options: [
          "git reset --hard HEAD~1",
          "git reset --soft HEAD~1",
          "git revert HEAD",
          "git checkout HEAD~1",
        ],
        answer: 1,
        explanation:
          "--soft annule le commit mais garde les modifs en staged. --hard supprime les modifs. revert crée un commit d'annulation.",
      },
      {
        question: "Différence git fetch vs git pull ?",
        options: [
          "Aucune",
          "fetch récupère sans fusionner, pull = fetch + merge auto",
          "pull est plus sûr",
          "fetch ne marche que localement",
        ],
        answer: 1,
        explanation: "fetch met à jour les références distantes sans toucher ta branche. pull = fetch + merge.",
      },
      {
        question: "Que fait git stash ?",
        options: [
          "Supprime des fichiers",
          "Sauvegarde temporairement les modifs non committées",
          "Crée une nouvelle branche",
          "Publie sur GitHub",
        ],
        answer: 1,
        explanation: "stash met de côté les modifs en cours. git stash pop les restaure.",
      },
      {
        question: "Que fait git cherry-pick ?",
        options: [
          "Supprime des commits",
          "Applique un commit spécifique sur la branche courante",
          "Fusionne des fichiers sélectionnés",
          "Copie une branche",
        ],
        answer: 1,
        explanation: "cherry-pick applique un commit précis (par hash) sur ta branche courante.",
      },
      {
        question: "Le flux Git Flow standard en entreprise ?",
        options: [
          "Tout le monde commit sur main",
          "feature/ → develop → main via release/",
          "Une branche par dev, jamais de main",
          "Uniquement des tags",
        ],
        answer: 1,
        explanation: "Git Flow : main (prod) ← develop (intégration) ← feature/xxx.",
      },
    ],
  },
  {
    id: "docker",
    label: "Docker / PHP",
    icon: "🐳",
    color: "#60a5fa",
    content: [
      {
        q: "Image Docker vs Container",
        a: `Image → blueprint immutable construit depuis un Dockerfile.
Contient l'OS minimal, les dépendances, le code.

Container → instance en cours d'exécution d'une image.
Plusieurs containers peuvent tourner depuis la même image.

docker build -t mon-app .        # construit l'image
docker run -p 3000:3000 mon-app  # lance un container
docker ps                         # liste les containers actifs

Analogie : l'image est la recette, le container est le plat.`,
      },
      {
        q: "Dockerfile : instructions principales",
        a: `FROM node:18-alpine    # image de base
WORKDIR /app           # répertoire de travail
COPY package*.json ./  # copier les dépendances d'abord (cache layers)
RUN npm install        # exécuté au BUILD
COPY . .               # copier le reste du code
EXPOSE 3000            # documenter le port
CMD ["node","server"]  # commande au démarrage

RUN          → au build
CMD          → au démarrage du container
COPY vs ADD  → préférer COPY (ADD supporte URLs/archives mais moins prévisible)

⚠️ Chaque instruction = un layer. Regrouper les RUN pour optimiser.`,
      },
      {
        q: "PHP : PDO vs mysql_ et protection injection SQL",
        a: `mysql_ est déprécié depuis PHP 5.5, supprimé en PHP 7.

PDO (PHP Data Objects) :
→ Multi-BDD (MySQL, PostgreSQL, SQLite...)
→ Requêtes préparées (protection injection SQL)
→ Gestion d'erreurs via exceptions

$pdo = new PDO("mysql:host=localhost;dbname=db", $user, $pass);
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => $email]); // jamais directement dans le SQL
$user = $stmt->fetch(PDO::FETCH_ASSOC);`,
      },
    ],
    quiz: [
      {
        question: "Différence COPY vs ADD dans un Dockerfile ?",
        options: [
          "Aucune",
          "ADD décompresse les archives et supporte les URLs, COPY est plus simple et préféré",
          "COPY est plus lent",
          "ADD ne marche que pour les binaires",
        ],
        answer: 1,
        explanation:
          "COPY est recommandé pour les fichiers locaux. ADD supporte les .tar et les URLs mais est moins prévisible.",
      },
      {
        question: "Que permet docker-compose ?",
        options: [
          "Créer des images plus vite",
          "Définir et lancer plusieurs containers liés avec un seul YAML",
          "Publier sur Docker Hub",
          "Monitorer en production",
        ],
        answer: 1,
        explanation: "docker-compose.yml définit les services, volumes, réseaux. docker-compose up lance toute la stack.",
      },
      {
        question: "En PHP, que retourne var_dump(0 == 'hello') avant PHP 8 ?",
        options: ["false", "true", "Erreur", "null"],
        answer: 1,
        explanation:
          "Bug PHP historique : == convertit 'hello' en int (0) et compare 0 == 0 → true. Corrigé en PHP 8. Toujours utiliser ===.",
      },
      {
        question: "Qu'est-ce qu'un volume Docker ?",
        options: [
          "RAM allouée",
          "Mécanisme pour persister des données hors du cycle de vie du container",
          "Nombre de containers max",
          "Image compressée",
        ],
        answer: 1,
        explanation: "Sans volume, les données disparaissent quand le container est supprimé.",
      },
      {
        question: "abstract class vs interface en PHP ?",
        options: [
          "Aucune différence",
          "Interface = contrat pur (signatures), abstract class peut avoir des méthodes implémentées et du state",
          "On peut instancier une abstract class",
          "Interface = héritage simple uniquement",
        ],
        answer: 1,
        explanation:
          "Interface : que des signatures. Abstract class : méthodes concrètes + abstraites + propriétés.",
      },
    ],
  },
];