import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import mediaRoutes from "./routes/media.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/media", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Media App Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
