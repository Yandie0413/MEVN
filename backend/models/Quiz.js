const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["single", "multiple"], default: "single" },
  options: [{ type: String }],
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  points: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
