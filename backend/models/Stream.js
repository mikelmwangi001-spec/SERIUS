const mongoose = require("mongoose");
const { STREAM_STATUS } = require("../config/constants");

const streamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Stream title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    streamer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ["Gaming", "Music", "Art", "Sports", "Education", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: Object.values(STREAM_STATUS),
      default: STREAM_STATUS.SCHEDULED,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewerCount: {
      type: Number,
      default: 0,
    },
    peakViewerCount: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0, // in minutes
    },
    isMonetized: {
      type: Boolean,
      default: false,
    },
    entryFee: {
      type: Number,
      default: 0, // in cents (0 = free)
    },
    revenue: {
      type: Number,
      default: 0,
    },
    tags: [String],
    schedule: {
      recurringDays: [String], // ["Monday", "Wednesday", "Friday"]
      startTime: String, // "14:00"
    },
  },
  { timestamps: true }
);

// Calculate duration when stream ends
streamSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.floor(durationMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

// Index for efficient queries
streamSchema.index({ streamer: 1, createdAt: -1 });
streamSchema.index({ status: 1 });
streamSchema.index({ category: 1 });

module.exports = mongoose.model("Stream", streamSchema);
