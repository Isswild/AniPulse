// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../db.js"; // <-- use your Neon pool

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-me";

// POST /api/auth/register
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      // Check if username or email already exists
      const existing = await pool.query(
        `SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1`,
        [username, email]
      );

      if (existing.rows.length > 0) {
        return res
          .status(409)
          .json({ message: "Username or email already taken" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, COALESCE($4, 'viewer'))
         RETURNING id, username, email, role, created_at`,
        [username, email, passwordHash, role]
      );

      const user = result.rows[0];

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error("AniPulse: error registering user:", err);
      if (err.code === "23505") {
        // unique constraint from Postgres
        return res
          .status(409)
          .json({ message: "Username or email already taken" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [body("username").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const result = await pool.query(
        `SELECT id, username, email, password_hash, role
         FROM users
         WHERE username = $1
         LIMIT 1`,
        [username]
      );

      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = result.rows[0];

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error("AniPulse: error logging in:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
