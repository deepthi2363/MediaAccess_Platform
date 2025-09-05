import express from "express";
import authRoutes from "./routes/auth.js";
import mediaRoutes from "./routes/media.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

import analyticsRoutes from "./routes/analytics.js";

app.use("/media", mediaRoutes);
app.use("/analytics", analyticsRoutes);  // ✅ add
