// server.js
// AniPulse API - built by James Wilds III

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";             // still using Neon via pg pool
import jwt from "jsonwebtoken";         // still needed for auth middleware
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js"; // ✅ NEW: Prisma auth routes

dotenv.config();

// --- ESM path helpers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// make sure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// create app FIRST
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// use a real secret in .env: JWT_SECRET=some-long-random-string
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-this";

// ============= MULTER SETUP =============
// store files in /uploads and give them unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// ============= AUTH MIDDLEWARE =============
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload = { userId, username, role, iat, exp }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
}

// ============= ROOT ROUTE =============
app.get("/", (req, res) => {
  res.json({
    app: "AniPulse API",
    author: "James Wilds III",
    message: "Welcome to AniPulse — anime, discussions, fan art, quizzes.",
  });
});

// ============= AUTH ROUTES (via Prisma router) =============
// ✅ This now handles: POST /api/auth/register and POST /api/auth/login
app.use("/api/auth", authRouter);

// ============= USERS (public list) =============
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, avatar_url, bio, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============= CATEGORIES =============
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM discussion_categories ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============= DISCUSSION =============

// Get discussion threads
app.get("/api/threads", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id,
              t.title,
              t.body,
              t.created_at,
              u.username AS author,
              c.name AS category
       FROM discussion_threads t
       LEFT JOIN users u ON u.id = t.user_id
       LEFT JOIN discussion_categories c ON c.id = t.category_id
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching threads:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a discussion thread (protected)
app.post("/api/threads", requireAuth, async (req, res) => {
  const { category_id, title, body } = req.body;
  const user_id = req.user.userId; // from token
  try {
    const result = await pool.query(
      `INSERT INTO discussion_threads (user_id, category_id, title, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, body, created_at`,
      [user_id, category_id, title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("AniPulse: error creating thread:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============= ANIME LIST =============

// Get anime entries (public)
app.get("/api/anime", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              title,
              cover_image_url,
              year,
              season,
              streaming_url,
              drop_date,
              extra_notes
       FROM anime
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching anime:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single anime (for detail view)
app.get("/api/anime/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id,
              title,
              cover_image_url,
              year,
              season,
              streaming_url,
              drop_date,
              extra_notes
       FROM anime
       WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Anime not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("AniPulse: error fetching anime by id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create anime (ADMIN ONLY) — supports file upload OR URL
app.post(
  "/api/anime",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    const {
      title,
      cover_image_url,
      year,
      season,
      streaming_url,
      drop_date,
      extra_notes,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // prefer uploaded file, otherwise use URL from body
    let finalCover = null;
    if (req.file) {
      finalCover = `/uploads/${req.file.filename}`;
    } else if (cover_image_url) {
      finalCover = cover_image_url;
    }

    try {
      const result = await pool.query(
        `INSERT INTO anime (title, cover_image_url, year, season, streaming_url, drop_date, extra_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id,
                   title,
                   cover_image_url,
                   year,
                   season,
                   streaming_url,
                   drop_date,
                   extra_notes,
                   created_at`,
        [
          title,
          finalCover || null,
          year || null,
          season || null,
          streaming_url || null,
          drop_date || null,
          extra_notes || null,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("AniPulse: error creating anime:", err);
      res.status(500).json({ error: "Could not create anime" });
    }
  }
);

// Update extra anime info (ADMIN ONLY)
app.put("/api/anime/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { streaming_url, drop_date, extra_notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE anime
       SET streaming_url = $1,
           drop_date = $2,
           extra_notes = $3
       WHERE id = $4
       RETURNING id,
                 title,
                 cover_image_url,
                 year,
                 season,
                 streaming_url,
                 drop_date,
                 extra_notes`,
      [streaming_url || null, drop_date || null, extra_notes || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Anime not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("AniPulse: error updating anime:", err);
    res.status(500).json({ error: "Could not update anime" });
  }
});

// Delete anime (ADMIN ONLY)
app.delete("/api/anime/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM anime WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("AniPulse: error deleting anime:", err);
    res.status(500).json({ error: "Could not delete anime" });
  }
});

// Favorite anime (any logged-in user)
app.post("/api/anime/:id/favorite", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    await pool.query(
      `INSERT INTO anime_favorites (user_id, anime_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, anime_id) DO NOTHING`,
      [userId, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("AniPulse: error favoriting anime:", err);
    res.status(500).json({ error: "Could not favorite anime" });
  }
});

// Unfavorite anime (any logged-in user)
app.delete("/api/anime/:id/favorite", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    await pool.query(
      `DELETE FROM anime_favorites
       WHERE user_id = $1 AND anime_id = $2`,
      [userId, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("AniPulse: error unfavoriting anime:", err);
    res.status(500).json({ error: "Could not unfavorite anime" });
  }
});

// ============= FAN ART =============

// Upload fan art (logged-in user only)
app.post(
  "/api/fanart",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    const userId = req.user.userId;
    const { title, description, anime_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const animeId = anime_id ? Number(anime_id) : null;

    try {
      const result = await pool.query(
        `INSERT INTO fan_art (user_id, anime_id, title, description, image_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id,
                   user_id,
                   anime_id,
                   title,
                   description,
                   image_url,
                   created_at`,
        [userId, animeId, title || null, description || null, imageUrl]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("AniPulse: error uploading fan art:", err);
      res.status(500).json({ error: "Could not upload fan art" });
    }
  }
);

// Get fan art uploaded by the current user
app.get("/api/fanart/mine", requireAuth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT f.id,
              f.anime_id,
              a.title AS anime_title,
              f.title,
              f.description,
              f.image_url,
              f.created_at
       FROM fan_art f
       LEFT JOIN anime a ON a.id = f.anime_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching my fan art:", err);
    res.status(500).json({ error: "Could not fetch your fan art" });
  }
});

// Delete fan art (only by owner)
app.delete("/api/fanart/:id", requireAuth, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM fan_art
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Fan art not found or not yours" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("AniPulse: error deleting fan art:", err);
    res.status(500).json({ error: "Could not delete fan art" });
  }
});

// Get all fan art (community gallery)
app.get("/api/fanart", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id,
              f.anime_id,
              a.title AS anime_title,
              f.title,
              f.description,
              f.image_url,
              f.created_at,
              u.username
       FROM fan_art f
       JOIN users u ON u.id = f.user_id
       LEFT JOIN anime a ON a.id = f.anime_id
       ORDER BY f.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching fan art gallery:", err);
    res.status(500).json({ error: "Could not fetch fan art gallery" });
  }
});

// Get all favorites for the logged-in user
app.get("/api/favorites", requireAuth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      `SELECT a.id,
              a.title,
              a.cover_image_url,
              a.year,
              a.season
       FROM anime_favorites f
       JOIN anime a ON f.anime_id = a.id
       WHERE f.user_id = $1
       ORDER BY a.title ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("AniPulse: error fetching favorites:", err);
    res.status(500).json({ error: "Could not fetch favorites" });
  }
});

// ============= START SERVER =============
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AniPulse API running on port ${PORT}`);
});
