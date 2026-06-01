const express = require("express");
const cors = require("cors");

const courseRoutes = require("./routes/courses");
const chapterRoutes = require("./routes/chapters");
const quizRoutes = require("./routes/quizzes");
const progressRoutes = require("./routes/progress");
const certificateRoutes = require("./routes/certificates");
const reportRoutes = require("./routes/reports");

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use("/storage", express.static(path.join(__dirname, "storage")));

app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Erreur serveur" });
});

module.exports = app;
