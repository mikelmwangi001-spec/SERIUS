const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema(
  {
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Clip title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    startTime: {
      type: Number,
      required: true, // timestamp in stream
    },
    endTime: {
      type: Number,
      required: true, // timestamp in stream
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
clipSchema.index({ stream: 1, createdAt: -1 });
clipSchema.index({ creator: 1 });
clipSchema.index({ views: -1 });

module.exports = mongoose.model("Clip", clipSchema);
