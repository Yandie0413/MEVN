const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "" },
  level: {
    type: String,
    enum: ["débutant", "intermédiaire", "avancé"],
    default: "débutant",
  },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
