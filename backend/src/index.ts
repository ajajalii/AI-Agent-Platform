import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/auth";
import { authRoutes } from "./routes/auth.routes";
import { agentRoutes } from "./routes/agent.routes";
import { chatRoutes } from "./routes/chat.routes";
import { fileRoutes } from "./routes/file.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";

const app = express();

const mountRoute = (path: string, handler: unknown) => {
  if (typeof handler !== "function") {
    console.error(`Invalid route handler for ${path}:`, handler);
    throw new Error(`Invalid route handler for ${path}`);
  }

  app.use(path, handler as Router);
};

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

mountRoute("/api/auth", authRoutes);
mountRoute("/api/dashboard", dashboardRoutes);
mountRoute("/api/agents", agentRoutes);
mountRoute("/api/agents/:agentId/chats", chatRoutes);
mountRoute("/api/agents/:agentId/files", fileRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

export default app;
