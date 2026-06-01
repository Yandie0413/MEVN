const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  score: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["en attente", "attribué"],
    default: "en attente",
  },
  grade: { type: String, default: "" },
  pdfPath: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
});

module.exports = mongoose.model("Certificate", certificateSchema);
