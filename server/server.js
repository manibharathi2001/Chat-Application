// server.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

const FRONTEND_URLS = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
  : ["http://localhost:5173"];

// Middleware
app.use(
  cors({
    origin: FRONTEND_URLS,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// simple status route
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});

// create http server and attach express app
const server = http.createServer(app);

// Initialize Socket.IO and attach to the http server
export const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: FRONTEND_URLS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users: { userId: socketId }
export const userSocketMap = {};

// Socket connection handlers
io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId || socket.handshake.auth?.userId;
  console.log("Socket connected:", socket.id, "userId:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id, "userId:", userId);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("sendMessage", (msg) => {
    console.log("sendMessage", msg);
  });
});

// API routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to DB then start server
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Allowed CORS Origin: ${FRONTEND_URL}`);
});

export default app;
