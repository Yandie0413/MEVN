const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  quizAttempts: [quizAttemptSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", progressSchema);
