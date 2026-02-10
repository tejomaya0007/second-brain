import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/index.js";
import { connectDB } from "./config/database.js";

import knowledgeRoutes from "./routes/knowledge.js";
import authRoutes from "./routes/auth.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

/* =========================
   CORS (Vercel + Localhost)
========================= */
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser / server-to-server / health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.some((o) => o === origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
   Middleware
========================= */
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());

/* =========================
   Logger
========================= */
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

/* =========================
   Routes
========================= */
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok" })
);

app.get("/", (_req, res) =>
  res.json({
    message:
      "Second Brain API is running. Visit /api/health for status.",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/knowledge", knowledgeRoutes);

/* =========================
   Error Handling
========================= */
app.use(notFound);
app.use(errorHandler);

/* =========================
   Server
========================= */
const PORT = process.env.PORT || config.port || 4001;

const start = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

start();
