import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";
import { JWT_SECRET, TOKEN_EXPIRY } from "../config.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Add media (authenticated)
router.post("/", authenticateToken, upload.single("file"), async (req, res) => {
  const { title, type } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;

  await db.query("INSERT INTO MediaAsset (title, type, file_url) VALUES (?, ?, ?)", [title, type, fileUrl]);
  res.json({ message: "Media uploaded", fileUrl });
});

// Generate 10-min secure streaming link
router.get("/:id/stream-url", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const token = jwt.sign({ mediaId: id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  res.json({ url: `/media/${id}/stream?token=${token}` });
});

// Stream media if token valid
router.get("/:id/stream", async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.mediaId !== id) throw new Error("Invalid token");

    const [rows] = await db.query("SELECT file_url FROM MediaAsset WHERE id = ?", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Media not found" });

    res.sendFile(process.cwd() + rows[0].file_url);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
