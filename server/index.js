// server/index.js — Serveur Express

const express = require("express");
const cors    = require("cors");
const questionsRouter = require("./routes/questions");

const app  = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", questionsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Serveur opérationnel 🚀", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("❌ Erreur :", err.message);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📋 Test : http://localhost:${PORT}/api/health\n`);
});