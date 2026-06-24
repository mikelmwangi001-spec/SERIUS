const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    
    // Retry logic for production
    if (process.env.NODE_ENV === "production") {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("✗ MongoDB error:", err);
});

module.exports = connectDB;
