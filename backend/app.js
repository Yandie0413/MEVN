const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const courseRoutes = require("./routes/courses");
const chapterRoutes = require("./routes/chapters");
const quizRoutes = require("./routes/quizzes");
const progressRoutes = require("./routes/progress");
const certificateRoutes = require("./routes/certificates");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(helmet()); // Sécurise les headers HTTP
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes
});
app.use("/api/", limiter);

const path = require("path");
app.use("/storage", express.static(path.join(__dirname, "storage")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use(errorHandler);

module.exports = app;
