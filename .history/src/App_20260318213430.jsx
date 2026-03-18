import { useState, useEffect } from "react";

/* ─── DONNÉES DE BASE ──────────────────────────────────────────────── */
const BASE_SECTIONS = [
  {
    id: "htmlcss", label: "HTML / CSS", icon: "🎨", color: "#f97316",
    content: [
      { q: "Différences entre position: static, relative, absolute, fixed, sticky", a: `static → flux normal, top/left sans effet.\n\nrelative → reste dans le flux, décalé par rapport à sa position normale. Crée un contexte de positionnement pour ses enfants absolus.\n\nabsolute → sorti du flux. Se positionne par rapport à son ancêtre positionné le plus proche. S'il n'en a pas → par rapport au <html>.\n\nfixed → sorti du flux. Ancré sur le viewport. Reste visible au scroll.\n\nsticky → hybride : relatif jusqu'à un seuil de scroll (top: Xpx), puis se fixe comme fixed.\n\n⚠️ Piège : un absolute cherche un ancêtre avec position !== static.` },
      { q: "Différences entre Flexbox et CSS Grid", a: `Flexbox → 1D (une direction : row ou column). Pour aligner des items dans une ligne ou colonne.\n\nGrid → 2D (lignes ET colonnes). Pour des layouts de page complets.\n\nRègle simple :\n→ Aligner des items dans un composant = Flexbox\n→ Structure globale de la page = Grid\n\n⚠️ Différence justify-content vs align-items en Flex :\n→ justify-content : axe principal (direction du flex)\n→ align-items : axe transversal` },
      { q: "Qu'est-ce que la spécificité CSS ?", a: `La cascade détermine quelle règle "gagne" quand plusieurs s'appliquent.\n\nOrdre (du + fort au - fort) :\n1. !important (à éviter)\n2. style inline\n3. ID → #id (1-0-0)\n4. Class, attribut, pseudo-class → .class, :hover (0-1-0)\n5. Élément → div, h1 (0-0-1)\n\nExemple : #nav .link:hover = 1-1-1 bat .link (0-1-0)` },
      { q: "Qu'est-ce que le Box Model ?", a: `Tout élément HTML est une boîte : content → padding → border → margin\n\nbox-sizing: content-box (défaut) → width = contenu uniquement. Padding et border s'ajoutent.\n\nbox-sizing: border-box (recommandé) → width inclut padding + border.\n\nReset standard :\n*, *::before, *::after { box-sizing: border-box; }` },
    ],
    quiz: [
      { question: "Un élément position:absolute se positionne par rapport à :", options: ["Toujours le viewport", "Son ancêtre positionné (position !== static) le plus proche", "Toujours le <body>", "Son parent direct"], answer: 1, explanation: "Il remonte le DOM jusqu'à trouver un ancêtre positionné. S'il n'en trouve pas, il se positionne par rapport au <html>." },
      { question: "Quelle valeur de position permet de rester visible en scrollant ?", options: ["relative", "absolute", "sticky", "fixed"], answer: 3, explanation: "fixed est ancré sur le viewport, indépendamment du scroll." },
      { question: "Avec box-sizing: content-box, un div width:200px + padding:20px a une largeur totale de :", options: ["200px", "220px", "240px", "180px"], answer: 2, explanation: "content-box : largeur réelle = 200 + 20 (gauche) + 20 (droite) = 240px." },
      { question: "Pour un layout header + sidebar + contenu, la meilleure approche est :", options: ["Flexbox uniquement", "CSS Grid", "position absolute partout", "Float"], answer: 1, explanation: "Grid est fait pour les layouts 2D avec lignes et colonnes simultanées." },
      { question: "Quelle règle a la plus haute spécificité ?", options: [".nav li a:hover", "#header .nav a", "div > ul > li > a", "body div span"], answer: 1, explanation: "#header .nav a = 1 ID + 1 class + 1 element = 1-1-1. L'ID domine." },
    ]
  },
  {
    id: "js", label: "JavaScript / TS", icon: "⚡", color: "#eab308",
    content: [
      { q: "Que font async, await, try et catch ?", a: `async → marque une fonction comme asynchrone. Elle retourne toujours une Promise.\n\nawait → met en pause l'exécution jusqu'à ce que la Promise se resolve.\n\ntry/catch → gestion d'erreurs. Si la Promise rejette, on tombe dans catch.\n\nasync function fetchUser(id) {\n  try {\n    const res = await fetch(\`/api/users/\${id}\`);\n    if (!res.ok) throw new Error("Not found");\n    return await res.json();\n  } catch (err) {\n    console.error(err.message);\n  }\n}\n\n⚠️ Sans try/catch, une Promise rejectée = UnhandledPromiseRejection.` },
      { q: "Différences entre var, let et const", a: `var → portée fonctionnelle, hoistée, peut être re-déclarée. À ne jamais utiliser.\n\nlet → portée de bloc ({}), peut être réassignée.\n\nconst → portée de bloc, ne peut pas être réassignée.\n⚠️ Mais si c'est un objet/tableau, son contenu peut changer :\nconst user = { name: "A" };\nuser.name = "B"; // ✅ OK\nuser = {};       // ❌ Erreur\n\nRègle : const par défaut, let si réassignation, jamais var.` },
      { q: "TypeScript : interface vs type", a: `Les deux décrivent la forme d'un objet, mais :\n\ninterface → peut être étendue (extends) et fusionnée (declaration merging). Préférée pour les objets et les contrats d'API.\n\ntype → plus flexible : unions, intersections, primitives, tuples. Ne peut pas être fusionné.\n\ntype ID = string | number; // impossible avec interface\ntype Admin = User & { role: "admin" }; // intersection\n\nEn pratique : interface pour les objets, type pour le reste.` },
      { q: "Qu'est-ce qu'une closure (fermeture) ?", a: `Une closure = une fonction qui "se souvient" de son environnement lexical après que la fonction parente a terminé.\n\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count; // capture count\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2\n\nC'est la base de useState, useEffect et du module pattern.` },
    ],
    quiz: [
      { question: "Que retourne une fonction async qui fait return 42 ?", options: ["Le nombre 42", "Promise.resolve(42)", "Promise.reject(42)", "undefined"], answer: 1, explanation: "Toute fonction async retourne implicitement une Promise." },
      { question: "Que vaut typeof null ?", options: ["null", "undefined", "object", "string"], answer: 2, explanation: "Bug historique de JS (1995). typeof null = 'object'. Pour tester null, utiliser === null." },
      { question: "Différence entre == et === ?", options: ["Aucune", "=== compare valeur + type, == fait une coercition", "== est plus strict", "=== ne marche qu'avec les primitives"], answer: 1, explanation: "'5' == 5 → true (coercition). '5' === 5 → false. Toujours utiliser ===." },
      { question: "En TypeScript, unknown vs any ?", options: ["Identiques", "unknown force une vérification de type avant utilisation, any non", "any est plus restrictif", "unknown n'existe pas"], answer: 1, explanation: "any désactive le contrôle de type. unknown oblige à vérifier (typeof, instanceof) avant d'utiliser la valeur." },
      { question: "Quel est le résultat de : [1,2,3].map(x => x * 2) ?", options: ["[1,2,3]", "[2,4,6]", "6", "undefined"], answer: 1, explanation: "map crée un nouveau tableau en appliquant la fonction à chaque élément." },
    ]
  },
  {
    id: "react", label: "React", icon: "⚛️", color: "#38bdf8",
    content: [
      { q: "Différences entre hooks et props", a: `Props → communication parent → enfant. En lecture seule dans le composant qui les reçoit. Viennent de l'extérieur.\n\nHooks → fonctions spéciales (useXxx) qui gèrent la logique interne du composant (état, effets, contexte...).\n\nfunction Button({ label, onClick }) { // ← props\n  const [active, setActive] = useState(false); // ← hook\n  return <button onClick={() => { setActive(true); onClick(); }}>{label}</button>;\n}\n\n⚠️ Règle : hooks uniquement dans des composants fonctionnels, jamais dans des conditions ou boucles.` },
      { q: "useEffect : comment ça fonctionne ?", a: `useEffect exécute des effets de bord (appels API, DOM, subscriptions) après le rendu.\n\nuseEffect(() => { /* effet */ }, [deps]);\n\n[] vide → s'exécute une fois au montage\n[var] → s'exécute quand var change\nsans tableau → s'exécute à chaque rendu (souvent un bug !)\n\nCleanup : le return nettoie avant relance ou démontage.\nuseEffect(() => {\n  const sub = subscribe(id);\n  return () => sub.unsubscribe();\n}, [id]);\n\n⚠️ Oublier une dépendance → données stale (périmées).` },
      { q: "Qu'est-ce que le Virtual DOM ?", a: `Le DOM réel est lent à manipuler. React utilise un Virtual DOM (représentation JS légère).\n\nProcessus (reconciliation) :\n1. État change → React re-render → nouveau Virtual DOM\n2. Diffing : compare ancien et nouveau Virtual DOM\n3. Patching : applique uniquement les différences au DOM réel\n\nRésultat : mises à jour minimales et performantes.\n\nReact Fiber (depuis React 16) : moteur amélioré qui peut prioriser et interrompre les mises à jour.` },
      { q: "Context API vs Redux : quand utiliser quoi ?", a: `Context API → passer des données sans prop drilling (N niveaux de parents).\nIdéal pour : thème, langue, utilisateur connecté (données peu changeantes).\n\nconst ThemeCtx = createContext("light");\n<ThemeCtx.Provider value="dark"><App /></ThemeCtx.Provider>\nconst theme = useContext(ThemeCtx); // n'importe où\n\nRedux → état complexe, fréquemment modifié, gros projet d'équipe, besoin de devtools.\n\n⚠️ Context avec données qui changent souvent = re-renders inutiles de tous les abonnés.` },
    ],
    quiz: [
      { question: "Pourquoi ne peut-on pas appeler un hook dans un if ?", options: ["On peut, c'est autorisé", "React suit les hooks par ordre d'appel, une condition changerait cet ordre", "Les hooks retournent undefined dans un if", "Le composant se démonte"], answer: 1, explanation: "React identifie les hooks par leur ordre d'appel. Si cet ordre change entre deux rendus, React ne sait plus quel état correspond à quel hook." },
      { question: "Différence entre useMemo et useCallback ?", options: ["Identiques", "useMemo mémoïse une valeur calculée, useCallback mémoïse une fonction", "Le contraire", "useMemo est pour les classes"], answer: 1, explanation: "useMemo retourne le résultat d'un calcul mémoïsé. useCallback retourne une référence de fonction mémoïsée. Utiles pour éviter les re-renders inutiles." },
      { question: "Dans quels cas un composant React se re-render ?", options: ["Uniquement si ses props changent", "Uniquement si son state change", "Si ses props changent, son state change, ou son parent se re-render", "Uniquement avec forceUpdate()"], answer: 2, explanation: "Par défaut, un composant re-render si : state change, props changent, ou parent re-render. React.memo évite les re-renders inutiles dus au parent." },
      { question: "Quel hook pour accéder directement à un élément DOM (ex: focus) ?", options: ["useState", "useEffect", "useRef", "useCallback"], answer: 2, explanation: "useRef retourne { current: ... } sans déclencher de re-render. On l'attache via ref={monRef}, puis monRef.current.focus()." },
      { question: "Composant contrôlé vs non contrôlé ?", options: ["Contrôlé = classes, non contrôlé = fonctions", "Contrôlé = valeur liée au state React, non contrôlé = valeur gérée par le DOM", "Non contrôlé = sans props", "Contrôlé = sans useEffect"], answer: 1, explanation: "Contrôlé : value={state} + onChange → React gère la valeur. Non contrôlé : on lit via useRef. Les formulaires contrôlés sont plus prévisibles et testables." },
    ]
  },
  {
    id: "sql", label: "SQL / BDD", icon: "🗄️", color: "#34d399",
    content: [
      { q: "Types de JOIN et leurs différences", a: `INNER JOIN → uniquement les lignes avec correspondance dans les deux tables.\n\nLEFT JOIN → toutes les lignes de gauche + correspondances de droite (NULL si absent).\n\nRIGHT JOIN → inverse du LEFT JOIN.\n\nFULL OUTER JOIN → toutes les lignes des deux tables, NULL là où pas de correspondance.\n\nExemple :\nSELECT u.name, o.id\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n-- Retourne tous les users, même sans commande\n\n⚠️ INNER = intersection. LEFT = toutes les lignes de gauche.` },
      { q: "Qu'est-ce qu'un index SQL ?", a: `Un index (B-Tree) accélère les recherches sur une colonne, au coût d'espace disque et de ralentissement des écritures.\n\nSans index : full table scan (toutes les lignes parcourues).\nAvec index : accès direct, comme un index de livre.\n\nQuand indexer ?\n→ Colonnes dans WHERE, JOIN ON, ORDER BY\n→ Colonnes avec forte cardinalité (beaucoup de valeurs distinctes)\n\nCREATE INDEX idx_email ON users(email);\n\n⚠️ Sur-indexer dégrade les INSERT/UPDATE/DELETE.` },
      { q: "ACID : les 4 propriétés d'une transaction", a: `A - Atomicité : tout ou rien. Si une opération échoue → ROLLBACK complet.\n\nC - Cohérence : la BDD passe d'un état valide à un autre. Les contraintes sont respectées.\n\nI - Isolation : les transactions concurrentes ne s'interfèrent pas.\n\nD - Durabilité : un COMMIT est persisté même en cas de panne.\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT; -- Les deux ou aucun` },
      { q: "SQL vs NoSQL : différences et cas d'usage", a: `SQL (MySQL, PostgreSQL) :\n→ Schéma fixe, tables relationnelles\n→ Transactions ACID\n→ Relations complexes entre tables\n→ Idéal : e-commerce, banque, ERP\n\nNoSQL (MongoDB, Redis, Cassandra) :\n→ Schéma flexible\n→ Scalabilité horizontale native\n→ Hautes performances en lecture/écriture massives\n→ Idéal : logs temps réel, cache, big data\n\nPas de "meilleur" absolu : dépend du use case.` },
    ],
    quiz: [
      { question: "Quelle requête retourne tous les users même sans commande ?", options: ["INNER JOIN", "LEFT JOIN orders", "RIGHT JOIN orders", "CROSS JOIN"], answer: 1, explanation: "LEFT JOIN retourne toutes les lignes de la table de gauche. Celles sans correspondance auront NULL dans les colonnes de la table de droite." },
      { question: "Différence entre WHERE et HAVING ?", options: ["Aucune", "WHERE filtre avant GROUP BY, HAVING filtre après l'agrégation", "HAVING fonctionne sans GROUP BY", "WHERE est pour les strings"], answer: 1, explanation: "WHERE filtre les lignes individuelles. HAVING filtre les groupes (après GROUP BY). Ex: HAVING COUNT(*) > 5." },
      { question: "Qu'est-ce qu'une injection SQL ?", options: ["Insérer des emojis", "Attaque via entrée utilisateur — protection : requêtes préparées", "Méthode d'optimisation", "Bug MySQL uniquement"], answer: 1, explanation: "Ex: ' OR '1'='1. Protection : TOUJOURS utiliser des requêtes préparées/paramétrisées. Jamais concaténer directement une entrée utilisateur dans du SQL." },
      { question: "Qu'est-ce qu'une PRIMARY KEY ?", options: ["Colonne avec doublons", "Identifiant unique + NOT NULL pour chaque ligne", "Clé qui pointe vers une autre table", "Contrainte sur les entiers uniquement"], answer: 1, explanation: "PRIMARY KEY = UNIQUE + NOT NULL. Identifie de manière unique chaque enregistrement. Une table = une seule clé primaire." },
      { question: "L'opération la plus coûteuse sans index est :", options: ["INSERT", "SELECT avec WHERE sur colonne non indexée", "DELETE avec WHERE sur clé primaire", "UPDATE d'une seule ligne"], answer: 1, explanation: "Sans index, un SELECT avec WHERE fait un full table scan : chaque ligne est examinée. Avec index, accès direct en O(log n)." },
    ]
  },
  {
    id: "git", label: "Git / GitHub", icon: "🐙", color: "#a78bfa",
    content: [
      { q: "git merge vs git rebase", a: `merge → fusionne deux branches en créant un merge commit. Préserve l'historique complet.\n\nrebase → réapplique les commits de ta branche sur la pointe d'une autre. Historique linéaire et propre, mais réécrit l'historique.\n\n# Merge\ngit checkout main && git merge feature/login\n\n# Rebase\ngit checkout feature/login && git rebase main\n\n⚠️ Règle d'or : ne JAMAIS rebase une branche publique/partagée (ça casse le travail des autres).` },
      { q: "Qu'est-ce qu'une Pull Request et les bonnes pratiques ?", a: `Une PR = demande de fusion d'une branche vers une autre (feature → main/develop).\n\nElle permet :\n→ Code review par les pairs\n→ Discussions et suggestions\n→ Exécution automatique des tests (CI/CD)\n→ Traçabilité des changements\n\nBonnes pratiques :\n→ 1 PR = 1 feature ou 1 bugfix (petites PRs)\n→ Bien décrire : quoi, pourquoi, comment tester\n→ Au moins 1 reviewer\n→ Ne jamais merger sa propre PR sans review` },
      { q: "Qu'est-ce que CI/CD ? GitHub Actions ?", a: `CI (Continuous Integration) → à chaque push, tests automatiques lancés pour détecter les régressions.\n\nCD (Continuous Delivery/Deployment) → si les tests passent, déploiement automatique en staging ou prod.\n\nGitHub Actions : système d'automatisation en YAML.\n\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm install && npm test\n\nMentionner CI/CD en entretien = culture DevOps et qualité.` },
    ],
    quiz: [
      { question: "Annuler le dernier commit SANS perdre les modifications ?", options: ["git reset --hard HEAD~1", "git reset --soft HEAD~1", "git revert HEAD", "git checkout HEAD~1"], answer: 1, explanation: "--soft annule le commit mais garde les modifs en staged. --hard supprime les modifs (dangereux). revert crée un nouveau commit d'annulation (plus sûr sur branche publique)." },
      { question: "Différence git fetch vs git pull ?", options: ["Aucune", "fetch récupère sans fusionner, pull = fetch + merge auto", "pull est plus sûr", "fetch ne marche que localement"], answer: 1, explanation: "fetch met à jour les références distantes localement sans toucher ta branche. pull = fetch + merge (ou rebase). Préférer fetch + review avant merge en équipe." },
      { question: "Que fait git stash ?", options: ["Supprime des fichiers", "Sauvegarde temporairement les modifs non committées", "Crée une nouvelle branche", "Publie sur GitHub"], answer: 1, explanation: "stash met de côté les modifs en cours pour changer de branche proprement. git stash pop restaure les modifs sauvegardées." },
      { question: "Que fait git cherry-pick ?", options: ["Supprime des commits", "Applique un commit spécifique sur la branche courante", "Fusionne des fichiers sélectionnés", "Copie une branche"], answer: 1, explanation: "cherry-pick applique un commit précis (par hash) sur ta branche courante. Utile pour backporter un bugfix urgent sans merger toute la branche." },
      { question: "Le flux Git Flow standard en entreprise ?", options: ["Tout le monde commit sur main", "feature/ → develop → main via release/", "Une branche par dev, jamais de main", "Uniquement des tags"], answer: 1, explanation: "Git Flow : main (prod) ← develop (intégration) ← feature/xxx. Aussi : hotfix/ (depuis main) et release/ (develop → main)." },
    ]
  },
  {
    id: "docker", label: "Docker / PHP", icon: "🐳", color: "#60a5fa",
    content: [
      { q: "Image Docker vs Container", a: `Image → blueprint immutable construit depuis un Dockerfile. Contient l'OS minimal, les dépendances, le code.\n\nContainer → instance en cours d'exécution d'une image. Plusieurs containers peuvent tourner depuis la même image.\n\ndocker build -t mon-app .       # construit l'image\ndocker run -p 3000:3000 mon-app # lance un container\ndocker ps                        # liste les containers actifs\n\nAnalogie : l'image est la recette, le container est le plat préparé.` },
      { q: "Dockerfile : instructions principales", a: `FROM node:18-alpine   # image de base\nWORKDIR /app          # répertoire de travail\nCOPY package*.json ./ # copie les dépendances d'abord (cache layers)\nRUN npm install       # exécuté au BUILD\nCOPY . .              # copie le reste du code\nEXPOSE 3000           # documente le port\nCMD ["node","server"] # commande au démarrage\n\nRUN → au build (installe des paquets)\nCMD/ENTRYPOINT → au démarrage du container\nCOPY vs ADD → préférer COPY (ADD supporte les URLs/archives mais moins prévisible)\n\n⚠️ Chaque instruction = un layer. Regrouper les RUN pour optimiser.` },
      { q: "PHP : PDO vs mysql_ et protection injection SQL", a: `Les fonctions mysql_ sont dépréciées depuis PHP 5.5, supprimées en PHP 7.\n\nPDO (PHP Data Objects) :\n→ Multi-BDD (MySQL, PostgreSQL, SQLite...)\n→ Requêtes préparées (protection injection SQL)\n→ Gestion d'erreurs via exceptions\n\n$pdo = new PDO("mysql:host=localhost;dbname=db", $user, $pass);\n$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");\n$stmt->execute([':email' => $email]); // jamais directement dans le SQL\n$user = $stmt->fetch(PDO::FETCH_ASSOC);` },
    ],
    quiz: [
      { question: "Différence COPY vs ADD dans un Dockerfile ?", options: ["Aucune", "ADD décompresse les archives et supporte les URLs, COPY est plus simple et préféré", "COPY est plus lent", "ADD ne marche que pour les binaires"], answer: 1, explanation: "COPY est recommandé pour copier des fichiers locaux. ADD fait la même chose mais supporte les .tar (auto-décompressés) et les URLs. Sa surpuissance le rend moins prévisible." },
      { question: "Que permet docker-compose ?", options: ["Créer des images plus vite", "Définir et lancer plusieurs containers liés avec un seul YAML", "Publier sur Docker Hub", "Monitorer en production"], answer: 1, explanation: "docker-compose.yml définit les services, leurs images, volumes, réseaux et env vars. docker-compose up lance toute la stack." },
      { question: "En PHP, que retourne var_dump(0 == 'hello') avant PHP 8 ?", options: ["false", "true", "Erreur", "null"], answer: 1, explanation: "Bug PHP historique : == convertit 'hello' en int (0) et compare 0 == 0 → true. Corrigé en PHP 8. Toujours utiliser ===." },
      { question: "Qu'est-ce qu'un volume Docker ?", options: ["RAM allouée", "Mécanisme pour persister des données hors du cycle de vie du container", "Nombre de containers max", "Image compressée"], answer: 1, explanation: "Sans volume, les données disparaissent quand le container est supprimé. Un volume monte un répertoire hôte dans le container pour persister les données." },
      { question: "abstract class vs interface en PHP ?", options: ["Aucune différence", "Interface = contrat pur (signatures), abstract class peut avoir des méthodes implémentées et du state", "On peut instancier une abstract class", "Interface = héritage simple uniquement"], answer: 1, explanation: "Interface : que des signatures, implémentable par plusieurs classes. Abstract class : méthodes concrètes + abstraites + propriétés. Une classe ne peut étendre qu'une seule abstract class." },
    ]
  },
];

const STORAGE_KEY = "prep-v2-data";

/* ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [sections, setSections] = useState(BASE_SECTIONS);
  const [activeId, setActiveId] = useState("htmlcss");
  const [tab, setTab] = useState("cours"); // cours | quiz | add
  const [expandedQ, setExpandedQ] = useState(null);
  const [quizState, setQuizState] = useState({ answers: {}, submitted: false });
  const [form, setForm] = useState({
    targetSection: "htmlcss",
    newSectionName: "",
    newSectionIcon: "📝",
    question: "",
    answer: "",
    addToQuiz: false,
    options: ["", "", "", ""],
    correct: 0,
    explanation: "",
  });
  const [saveMsg, setSaveMsg] = useState("");

  // Charger les données sauvegardées
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (!result) return;
        const saved = JSON.parse(result.value);
        setSections(prev => {
          let updated = [...prev];
          // Ajouter les questions aux sections existantes
          if (saved.additions) {
            updated = updated.map(s => {
              const add = saved.additions[s.id];
              if (!add) return s;
              return {
                ...s,
                content: [...s.content, ...(add.content || [])],
                quiz: [...s.quiz, ...(add.quiz || [])],
              };
            });
          }
          // Ajouter les sections custom
          if (saved.customSections) {
            const existingIds = updated.map(s => s.id);
            saved.customSections.forEach(cs => {
              if (!existingIds.includes(cs.id)) updated.push(cs);
            });
          }
          return updated;
        });
      } catch (_) { }
    })();
  }, []);

  // Sauvegarder dans storage
  const persistData = async (newSections) => {
    try {
      const builtInIds = BASE_SECTIONS.map(s => s.id);
      const additions = {};
      newSections.forEach(s => {
        if (builtInIds.includes(s.id)) {
          const base = BASE_SECTIONS.find(b => b.id === s.id);
          const extraContent = s.content.slice(base.content.length);
          const extraQuiz = s.quiz.slice(base.quiz.length);
          if (extraContent.length || extraQuiz.length) {
            additions[s.id] = { content: extraContent, quiz: extraQuiz };
          }
        }
      });
      const customSections = newSections.filter(s => !builtInIds.includes(s.id));
      await window.storage.set(STORAGE_KEY, JSON.stringify({ additions, customSections }));
    } catch (e) {
      console.error(e);
    }
  };

  const section = sections.find(s => s.id === activeId);

  const handleSectionChange = (id) => {
    setActiveId(id);
    setTab("cours");
    setExpandedQ(null);
    setQuizState({ answers: {}, submitted: false });
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "quiz") setQuizState({ answers: {}, submitted: false });
    if (t === "add") setForm(f => ({ ...f, targetSection: activeId }));
  };

  const handleAnswer = (qi, oi) => {
    if (quizState.submitted) return;
    setQuizState(s => ({ ...s, answers: { ...s.answers, [qi]: oi } }));
  };

  const score = quizState.submitted
    ? section.quiz.filter((q, i) => quizState.answers[i] === q.answer).length
    : 0;

  const handleAddQuestion = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    const newQ = { q: form.question.trim(), a: form.answer.trim(), custom: true };
    const newQz = form.addToQuiz && form.options.every(o => o.trim()) ? {
      question: form.question.trim(),
      options: form.options.map(o => o.trim()),
      answer: form.correct,
      explanation: form.explanation.trim() || "Question ajoutée manuellement.",
      custom: true,
    } : null;

    let newSections;
    if (form.targetSection === "__new__") {
      if (!form.newSectionName.trim()) return;
      const newSection = {
        id: "custom_" + Date.now(),
        label: form.newSectionName.trim(),
        icon: form.newSectionIcon,
        color: "#f472b6",
        content: [newQ],
        quiz: newQz ? [newQz] : [],
      };
      newSections = [...sections, newSection];
    } else {
      newSections = sections.map(s => s.id !== form.targetSection ? s : {
        ...s,
        content: [...s.content, newQ],
        quiz: newQz ? [...s.quiz, newQz] : s.quiz,
      });
    }

    setSections(newSections);
    await persistData(newSections);
    setSaveMsg("✅ Question ajoutée !");
    setTimeout(() => setSaveMsg(""), 3000);
    setForm(f => ({
      ...f,
      question: "", answer: "",
      addToQuiz: false, options: ["", "", "", ""],
      correct: 0, explanation: "",
      newSectionName: "", newSectionIcon: "📝",
    }));
  };

  // ─── THÈME ───
  const t = dark ? {
    bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
    text: "#e2e8f0", muted: "#64748b", input: "#0f1117",
  } : {
    bg: "#f1f5f9", card: "#ffffff", border: "#e2e8f0",
    text: "#1e293b", muted: "#94a3b8", input: "#f8fafc",
  };

  const acc = section?.color || "#38bdf8";

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", fontSize: 13 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }
        textarea, input, select { outline: none; font-family: inherit; }
        button { font-family: inherit; }
        .q-card:hover { border-color: ${acc}88 !important; }
        .nav-item:hover { background: ${acc}15 !important; }
        .opt-btn:hover:not(:disabled) { border-color: ${acc} !important; background: ${acc}18 !important; }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${t.border}`, background: t.card, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>💼</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: acc }}>ALTERNANCE PREP</div>
            <div style={{ fontSize: 10, color: t.muted }}>Entraînement technique · Licence 3</div>
          </div>
        </div>
        <button onClick={() => setDark(d => !d)} style={{ background: t.border, border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", color: t.text, fontSize: 12 }}>
          {dark ? "☀️ Clair" : "🌙 Sombre"}
        </button>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 53px)" }}>
        {/* ── SIDEBAR ── */}
        <div style={{ width: 180, borderRight: `1px solid ${t.border}`, background: t.card, overflowY: "auto", flexShrink: 0, padding: "8px 6px" }}>
          {sections.map(s => (
            <button key={s.id} className="nav-item" onClick={() => handleSectionChange(s.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
              background: activeId === s.id ? s.color + "20" : "transparent",
              border: `1px solid ${activeId === s.id ? s.color + "60" : "transparent"}`,
              borderRadius: 6, cursor: "pointer", color: activeId === s.id ? s.color : t.muted,
              fontWeight: activeId === s.id ? 600 : 400, textAlign: "left", fontSize: 12, marginBottom: 2,
              transition: "all 0.15s",
            }}>
              <span>{s.icon}</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 780 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
            {[["cours", "📖 Cours"], ["quiz", `🧪 Quiz (${section?.quiz.length || 0})`], ["add", "➕ Ajouter"]].map(([id, label]) => (
              <button key={id} onClick={() => handleTabChange(id)} style={{
                padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12,
                background: tab === id ? acc : t.border,
                color: tab === id ? (dark ? "#000" : "#fff") : t.muted,
                fontWeight: tab === id ? 600 : 400,
              }}>{label}</button>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 11, color: t.muted, alignSelf: "center" }}>
              {section?.icon} {section?.label}
            </div>
          </div>

          {/* ── COURS ── */}
          {tab === "cours" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section?.content.map((item, i) => (
                <div key={i} className="q-card" style={{
                  border: `1px solid ${expandedQ === i ? acc + "80" : t.border}`,
                  borderRadius: 8, background: t.card, overflow: "hidden", transition: "border-color 0.2s",
                }}>
                  <button onClick={() => setExpandedQ(expandedQ === i ? null : i)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer",
                    color: t.text, textAlign: "left", fontSize: 13, fontWeight: 500, gap: 12,
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.custom && <span style={{ fontSize: 10, color: acc, border: `1px solid ${acc}`, borderRadius: 3, padding: "1px 5px" }}>custom</span>}
                      {item.q}
                    </span>
                    <span style={{ color: acc, flexShrink: 0, fontSize: 10 }}>{expandedQ === i ? "▲" : "▼"}</span>
                  </button>
                  {expandedQ === i && (
                    <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${t.border}` }}>
                      <pre style={{
                        marginTop: 14, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 12,
                        lineHeight: 1.8, color: t.muted,
                      }}>
                        {item.a.split('\n').map((line, j) => {
                          if (line.startsWith('⚠️')) return <span key={j} style={{ color: "#f97316" }}>{line}<br /></span>;
                          if (line.match(/^(FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|BEGIN|COMMIT|SELECT|UPDATE|CREATE)/)) return <span key={j} style={{ color: acc }}>{line}<br /></span>;
                          if (line.match(/^#/)) return <span key={j} style={{ color: t.muted, opacity: 0.6 }}>{line}<br /></span>;
                          if (line.match(/^\$/)) return <span key={j} style={{ color: "#34d399" }}>{line}<br /></span>;
                          return <span key={j} style={{ color: dark ? "#cbd5e1" : "#475569" }}>{line}<br /></span>;
                        })}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── QUIZ ── */}
          {tab === "quiz" && (
            <div>
              {section?.quiz.length === 0 ? (
                <div style={{ textAlign: "center", color: t.muted, padding: 40 }}>
                  Aucune question de quiz pour cette section.<br />
                  <span style={{ color: acc, cursor: "pointer" }} onClick={() => handleTabChange("add")}>Ajouter une question →</span>
                </div>
              ) : (
                <>
                  {quizState.submitted && (
                    <div style={{
                      marginBottom: 20, padding: "12px 16px", borderRadius: 8,
                      background: score / section.quiz.length >= 0.8 ? "#14532d30" : score / section.quiz.length >= 0.6 ? "#713f1230" : "#7f1d1d30",
                      border: `1px solid ${score / section.quiz.length >= 0.8 ? "#22c55e" : score / section.quiz.length >= 0.6 ? "#f59e0b" : "#ef4444"}`,
                      color: score / section.quiz.length >= 0.8 ? "#22c55e" : score / section.quiz.length >= 0.6 ? "#f59e0b" : "#ef4444",
                      fontWeight: 600, textAlign: "center", fontSize: 14,
                    }}>
                      {score}/{section.quiz.length} — {score / section.quiz.length >= 0.8 ? "Excellent ✅" : score / section.quiz.length >= 0.6 ? "Correct ⚠️" : "À revoir ❌"}
                    </div>
                  )}

                  {section.quiz.map((q, i) => {
                    const sel = quizState.answers[i];
                    const ok = quizState.submitted && sel === q.answer;
                    const bad = quizState.submitted && sel !== undefined && sel !== q.answer;
                    return (
                      <div key={i} style={{
                        marginBottom: 16, background: t.card, borderRadius: 8, padding: 16,
                        border: `1px solid ${quizState.submitted ? (ok ? "#22c55e50" : bad ? "#ef444450" : t.border) : t.border}`,
                      }}>
                        <div style={{ fontWeight: 500, marginBottom: 10, color: t.text }}>
                          {i + 1}. {q.question}
                          {q.custom && <span style={{ fontSize: 10, color: acc, border: `1px solid ${acc}`, borderRadius: 3, padding: "1px 5px", marginLeft: 8 }}>custom</span>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {q.options.map((opt, j) => {
                            let bg = "transparent", bc = t.border, col = t.muted;
                            if (sel === j && !quizState.submitted) { bg = acc + "20"; bc = acc; col = t.text; }
                            if (quizState.submitted && j === q.answer) { bg = "#22c55e15"; bc = "#22c55e"; col = "#22c55e"; }
                            if (quizState.submitted && sel === j && j !== q.answer) { bg = "#ef444415"; bc = "#ef4444"; col = "#ef4444"; }
                            return (
                              <button key={j} className="opt-btn" disabled={quizState.submitted} onClick={() => handleAnswer(i, j)} style={{
                                padding: "8px 12px", background: bg, border: `1px solid ${bc}`, borderRadius: 6,
                                color: col, cursor: quizState.submitted ? "default" : "pointer",
                                textAlign: "left", fontSize: 12, transition: "all 0.15s",
                              }}>
                                {["A", "B", "C", "D"][j]}. {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizState.submitted && (
                          <div style={{ marginTop: 10, padding: "8px 12px", background: dark ? "#0f111780" : "#f8fafc", borderRadius: 6, fontSize: 11, color: t.muted, lineHeight: 1.6 }}>
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button onClick={() => {
                    if (!quizState.submitted) {
                      if (Object.keys(quizState.answers).length < section.quiz.length) return;
                      setQuizState(s => ({ ...s, submitted: true }));
                    } else {
                      setQuizState({ answers: {}, submitted: false });
                    }
                  }} style={{
                    width: "100%", padding: "12px", border: `1px solid ${acc}`, borderRadius: 8,
                    background: !quizState.submitted && Object.keys(quizState.answers).length < section.quiz.length ? t.border : acc + "20",
                    color: !quizState.submitted && Object.keys(quizState.answers).length < section.quiz.length ? t.muted : acc,
                    cursor: "pointer", fontWeight: 600, fontSize: 13,
                  }}>
                    {quizState.submitted ? "🔄 Recommencer" : `Valider (${Object.keys(quizState.answers).length}/${section.quiz.length})`}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── AJOUTER ── */}
          {tab === "add" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ color: t.muted, fontSize: 12, lineHeight: 1.6 }}>
                Ajoute une question depuis une IA, un cours ou tes notes. Les données sont sauvegardées localement.
              </p>

              {/* Section cible */}
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>SECTION CIBLE</label>
                <select value={form.targetSection} onChange={e => setForm(f => ({ ...f, targetSection: e.target.value }))} style={{
                  width: "100%", padding: "8px 10px", background: t.input, border: `1px solid ${t.border}`,
                  borderRadius: 6, color: t.text, fontSize: 12,
                }}>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                  <option value="__new__">➕ Nouvelle section…</option>
                </select>
              </div>

              {form.targetSection === "__new__" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: "0 0 60px" }}>
                    <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>ICÔNE</label>
                    <input value={form.newSectionIcon} onChange={e => setForm(f => ({ ...f, newSectionIcon: e.target.value }))} style={{
                      width: "100%", padding: "8px 10px", background: t.input, border: `1px solid ${t.border}`,
                      borderRadius: 6, color: t.text, fontSize: 18, textAlign: "center",
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>NOM DE LA SECTION</label>
                    <input value={form.newSectionName} onChange={e => setForm(f => ({ ...f, newSectionName: e.target.value }))} placeholder="ex: Node.js, TypeScript…" style={{
                      width: "100%", padding: "8px 10px", background: t.input, border: `1px solid ${t.border}`,
                      borderRadius: 6, color: t.text, fontSize: 12,
                    }} />
                  </div>
                </div>
              )}

              {/* Question */}
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>QUESTION *</label>
                <input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="ex: Quelle est la différence entre…" style={{
                  width: "100%", padding: "8px 10px", background: t.input, border: `1px solid ${t.border}`,
                  borderRadius: 6, color: t.text, fontSize: 12,
                }} />
              </div>

              {/* Réponse */}
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>RÉPONSE *</label>
                <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={5} placeholder="Colle ici la réponse (d'une IA ou ta propre explication)…" style={{
                  width: "100%", padding: "8px 10px", background: t.input, border: `1px solid ${t.border}`,
                  borderRadius: 6, color: t.text, fontSize: 12, resize: "vertical", lineHeight: 1.7,
                }} />
              </div>

              {/* Option quiz */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" id="addquiz" checked={form.addToQuiz} onChange={e => setForm(f => ({ ...f, addToQuiz: e.target.checked }))} style={{ accentColor: acc }} />
                <label htmlFor="addquiz" style={{ fontSize: 12, color: t.muted, cursor: "pointer" }}>Ajouter aussi au quiz (QCM)</label>
              </div>

              {form.addToQuiz && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14, background: dark ? "#ffffff08" : "#00000005", borderRadius: 8, border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>4 OPTIONS (A, B, C, D)</div>
                  {form.options.map((opt, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: form.correct === i ? acc : t.muted, fontSize: 11, width: 14 }}>{["A", "B", "C", "D"][i]}</span>
                      <input value={opt} onChange={e => setForm(f => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })} placeholder={`Option ${["A", "B", "C", "D"][i]}`} style={{
                        flex: 1, padding: "6px 10px", background: t.input, border: `1px solid ${form.correct === i ? acc : t.border}`,
                        borderRadius: 6, color: t.text, fontSize: 12,
                      }} />
                      <button onClick={() => setForm(f => ({ ...f, correct: i }))} style={{
                        padding: "4px 10px", borderRadius: 6, border: `1px solid ${form.correct === i ? acc : t.border}`,
                        background: form.correct === i ? acc + "25" : "transparent", color: form.correct === i ? acc : t.muted,
                        cursor: "pointer", fontSize: 11, flexShrink: 0,
                      }}>✓ correct</button>
                    </div>
                  ))}
                  <div style={{ marginTop: 4 }}>
                    <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 5 }}>EXPLICATION (optionnel)</label>
                    <input value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="Pourquoi cette réponse est correcte…" style={{
                      width: "100%", padding: "6px 10px", background: t.input, border: `1px solid ${t.border}`,
                      borderRadius: 6, color: t.text, fontSize: 12,
                    }} />
                  </div>
                </div>
              )}

              <button onClick={handleAddQuestion} style={{
                padding: "11px", background: acc, border: "none", borderRadius: 8, color: dark ? "#000" : "#fff",
                fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 4,
              }}>
                Sauvegarder la question
              </button>

              {saveMsg && <div style={{ color: "#22c55e", fontSize: 12, textAlign: "center" }}>{saveMsg}</div>}

              {/* Template IA */}
              <div style={{ marginTop: 10, padding: 14, background: dark ? "#ffffff06" : "#00000006", borderRadius: 8, border: `1px dashed ${t.border}` }}>
                <div style={{ fontSize: 11, color: acc, fontWeight: 600, marginBottom: 8 }}>💡 PROMPT À COPIER POUR GÉNÉRER DES QUESTIONS</div>
                <pre style={{ fontSize: 11, color: t.muted, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{`Génère 3 questions d'entretien de niveau Licence 3 sur le sujet [SUJET].
Pour chaque question, fournis :
- La question
- La réponse détaillée (3-5 lignes, exemples de code si pertinent)
- Un QCM avec 4 options et la bonne réponse indiquée
- Une explication courte de la réponse correcte`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}