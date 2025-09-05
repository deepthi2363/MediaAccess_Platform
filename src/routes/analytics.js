import express from "express";
import { db } from "../db/connection.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Log a view (IP + timestamp)
router.post("/:id/view", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Check if media exists
  const [mediaRows] = await db.query("SELECT * FROM MediaAsset WHERE id = ?", [id]);
  if (!mediaRows.length) {
    return res.status(404).json({ error: "Media not found" });
  }

  await db.query("INSERT INTO MediaViewLog (media_id, viewed_by_ip) VALUES (?, ?)", [id, ip]);
  res.json({ message: "View logged" });
});

// Get analytics for a media
router.get("/:id/analytics", authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Check if media exists
  const [mediaRows] = await db.query("SELECT * FROM MediaAsset WHERE id = ?", [id]);
  if (!mediaRows.length) {
    return res.status(404).json({ error: "Media not found" });
  }

  // Total views
  const [total] = await db.query("SELECT COUNT(*) as total_views FROM MediaViewLog WHERE media_id = ?", [id]);

  // Unique IPs
  const [unique] = await db.query("SELECT COUNT(DISTINCT viewed_by_ip) as unique_ips FROM MediaViewLog WHERE media_id = ?", [id]);

  // Views per day
  const [viewsPerDay] = await db.query(`
    SELECT DATE(timestamp) as day, COUNT(*) as views
    FROM MediaViewLog
    WHERE media_id = ?
    GROUP BY DATE(timestamp)
    ORDER BY day ASC
  `, [id]);

  const formattedViews = {};
  viewsPerDay.forEach(row => {
    formattedViews[row.day] = row.views;
  });

  res.json({
    total_views: total[0].total_views,
    unique_ips: unique[0].unique_ips,
    views_per_day: formattedViews
  });
});

export default router;
