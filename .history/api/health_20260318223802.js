// api/health.js  →  route : /api/health

export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Serveur opérationnel 🚀",
    timestamp: new Date().toISOString(),
  });
}