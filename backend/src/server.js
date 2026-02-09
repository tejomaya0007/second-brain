import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import { connectDB } from "./config/database.js";
import knowledgeRoutes from "./routes/knowledge.js";
import authRoutes from "./routes/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Middleware order matters!
app.use(cors({ 
  origin: config.corsOrigin, 
  credentials: true 
}));
// Increase JSON body limit so pages with base64 attachments can be saved.
// Frontend restricts uploads to 5 MB; base64 expands size ~1.3x, so 15mb is safe.
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser()); // Must be before routes

// Simple request logger: [GET] /api/knowledge 200
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routes
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.json({ message: "Second Brain API is running. Visit /api/health for status." }));
app.use("/api/auth", authRoutes);
app.use("/api/knowledge", knowledgeRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Use Railway/hosting port if provided, otherwise fall back to config.port or 4001
const PORT = process.env.PORT || config.port || 4001;

const start = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

start();
