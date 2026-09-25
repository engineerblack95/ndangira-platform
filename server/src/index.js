import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemsRoutes from "./routes/itemsRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== Static files (uploaded images) =====
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ===== Routes =====
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      ok: true,
      message: "Ndangira API is running",
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ===== Start =====
app.listen(PORT, () => {
  console.log(`Ndangira API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});