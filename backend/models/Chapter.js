const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  order: { type: Number, default: 1 },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chapter", chapterSchema);
