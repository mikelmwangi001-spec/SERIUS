require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const connectDB = require("./config/db");
const { errorHandler } = require("./utils/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const streamRoutes = require("./routes/stream");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO events
io.on("connection", (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  // Join stream room
  socket.on("join-stream", (streamId) => {
    socket.join(`stream-${streamId}`);
    io.to(`stream-${streamId}`).emit("user-joined", {
      userId: socket.id,
      timestamp: new Date(),
    });
  });

  // Chat message
  socket.on("chat-message", (data) => {
    io.to(`stream-${data.streamId}`).emit("new-message", {
      userId: data.userId,
      message: data.message,
      timestamp: new Date(),
    });
  });

  // Leave stream
  socket.on("leave-stream", (streamId) => {
    socket.leave(`stream-${streamId}`);
    io.to(`stream-${streamId}`).emit("user-left", {
      userId: socket.id,
      timestamp: new Date(),
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`✗ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⚠ Shutting down gracefully...");
  server.close(() => {
    console.log("✓ Server closed");
    process.exit(0);
  });
});

module.exports = { app, io };
