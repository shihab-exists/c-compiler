import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import compilerRoutes from "./routes/compiler.routes";
import snippetRoutes from "./routes/snippet.routes";
import aiRoutes from "./routes/ai.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler } from "./middleware/error.middleware";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

// WebSocket for real-time compiler output
io.on("connection", (socket) => {
  console.log("WS client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("WS client disconnected:", socket.id);
  });
});

// Make io available to routes via middleware
app.use((req, _res, next) => {
  (req as any).io = io;
  next();
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 C Compiler backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  httpServer.close(() => console.log("Server closed"));
});

export { io };
