import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// security + parsing
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/tasks", taskRoutes);

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// fallback for SPA
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    next();
  }
});

// error handler
app.use((err, _req, res, _next) => {
  console.error("❌", err);
  res.status(500).json({ error: "Server error" });
});

// start server
const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
};
start();
