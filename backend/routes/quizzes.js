const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protect, restrictTo } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");
const Joi = require("joi");

router.post("/", protect, restrictTo("admin"), quizController.createQuiz);
router.get("/", quizController.getQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/:id/submit", protect, quizController.submitQuiz);
router.put("/:id", protect, restrictTo("admin"), quizController.updateQuiz);
router.delete("/:id", protect, restrictTo("admin"), quizController.deleteQuiz);

module.exports = router;
