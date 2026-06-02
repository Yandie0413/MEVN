const Quiz = require("../models/Quiz");
const Chapter = require("../models/Chapter");
const Course = require("../models/Course");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const pdfService = require("../services/pdfService");

const calculateQuizResult = (quiz, answers) => {
  let score = 0;
  let total = 0;
  const details = quiz.questions.map((question) => {
    const provided = answers[question._id] ?? answers[question._id.toString()];
    total += question.points;
    let correct = false;
    let awarded = 0;

    const norm = (v) =>
      v === undefined || v === null ? "" : String(v).trim().toLowerCase();

    if (question.type === "multiple") {
      const expected = Array.isArray(question.answer)
        ? question.answer.map(norm)
        : [norm(question.answer)];
      const actual = Array.isArray(provided)
        ? provided.map(norm)
        : provided
          ? [norm(provided)]
          : [];

      const expectedSet = new Set(expected);
      const correctCount = actual.filter((a) => expectedSet.has(a)).length;
      const incorrectCount = actual.filter((a) => !expectedSet.has(a)).length;
      const expectedCount = expected.length || 1;

      let fraction = (correctCount - 0.5 * incorrectCount) / expectedCount;
      if (fraction < 0) fraction = 0;
      if (fraction > 1) fraction = 1;

      awarded = Math.round(question.points * fraction * 100) / 100;
      correct = fraction === 1;
    } else {
      if (question.options && question.options.length) {
        correct = norm(provided) === norm(question.answer);
        awarded = correct ? question.points : 0;
      } else if (typeof question.answer === "number") {
        const val = parseFloat(provided);
        const tol =
          typeof question.tolerance === "number" ? question.tolerance : 0;
        if (!isNaN(val)) {
          correct = Math.abs(val - question.answer) <= tol;
          awarded = correct ? question.points : 0;
        }
      } else {
        correct = norm(provided) === norm(question.answer);
        awarded = correct ? question.points : 0;
      }
    }

    score += awarded;
    return {
      questionId: question._id,
      correct,
      awarded,
      maxPoints: question.points,
      expected: question.answer,
      provided,
    };
  });

  score = Math.round(score * 100) / 100;
  return { score, total, details };
};

const issueCertificateIfNeeded = async ({ userId, courseId, progress }) => {
  const SCORE_THRESHOLD = parseFloat(process.env.CERT_THRESHOLD) || 0.7; // 70%
  const COMPLETION_THRESHOLD =
    parseFloat(process.env.COMPLETION_THRESHOLD) || 0.8; // 80% of chapters

  const course = await Course.findById(courseId, "chapters");
  const totalChapters = course && course.chapters ? course.chapters.length : 0;
  const completed =
    progress && progress.completedChapters
      ? progress.completedChapters.length
      : 0;

  const completionRatio = totalChapters ? completed / totalChapters : 0;
  if (completionRatio < COMPLETION_THRESHOLD) {
    return null;
  }

  const attempts = progress.quizAttempts || [];
  const sumScore = attempts.reduce((s, a) => s + (a.score || 0), 0);
  const sumTotal = attempts.reduce((s, a) => s + (a.total || 0), 0);
  if (!sumTotal || sumTotal === 0) return null;

  const weightedPercent = sumScore / sumTotal; // 0..1
  if (weightedPercent < SCORE_THRESHOLD) return null;

  const grade =
    weightedPercent >= 0.9
      ? "Excellent"
      : weightedPercent >= 0.8
        ? "Très bien"
        : "Bien";

  const existing = await Certificate.findOne({
    user: userId,
    course: courseId,
  });
  if (existing) {
    existing.score = Math.round(weightedPercent * 10000) / 100;
    existing.status = "attribué";
    existing.grade = grade;
    existing.issuedAt = new Date();
    await existing.save();
    try {
      const { filePath, filename } =
        await pdfService.generateCertificatePdf(existing);
      existing.pdfPath = filePath;
      existing.pdfUrl = `/storage/certificates/${filename}`;
      await existing.save();
    } catch (err) {
      console.error("PDF generation failed:", err.message || err);
    }
    return existing;
  }

  const cert = await Certificate.create({
    user: userId,
    course: courseId,
    score: Math.round(weightedPercent * 10000) / 100,
    status: "attribué",
    grade,
    issuedAt: new Date(),
  });
  // Only generate and persist PDF if this is a real Mongoose document
  if (cert && cert._id && typeof cert.save === "function") {
    try {
      const { filePath, filename } =
        await pdfService.generateCertificatePdf(cert);
      cert.pdfPath = filePath;
      cert.pdfUrl = `/storage/certificates/${filename}`;
      await cert.save();
    } catch (err) {
      console.error("PDF generation failed:", err.message || err);
    }
  }
  return cert;
};

exports.calculateQuizResult = calculateQuizResult;
exports.issueCertificateIfNeeded = issueCertificateIfNeeded;

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);

    if (req.body.chapter) {
      await Chapter.findByIdAndUpdate(req.body.chapter, { quiz: quiz._id });
    }

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

exports.getQuizzes = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.course = req.query.courseId;
    if (req.query.chapterId) filter.chapter = req.query.chapterId;
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    const userId = req.user?.id || req.body.userId;
    const { answers } = req.body;
    if (!userId || !answers) {
      return res.status(400).json({ message: "userId et answers sont requis" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let progress = await Progress.findOne({
      user: user._id,
      course: quiz.course,
    });

    if (quiz.chapter) {
      const completedChapterIds =
        progress && Array.isArray(progress.completedChapters)
          ? progress.completedChapters.map((chapterId) => chapterId.toString())
          : [];

      if (!completedChapterIds.includes(quiz.chapter.toString())) {
        return res.status(400).json({
          message:
            "Impossible de soumettre ce quiz avant d'avoir terminé le chapitre",
        });
      }
    }

    const result = calculateQuizResult(quiz, answers);
    const passed = result.total ? result.score / result.total >= 0.7 : false;

    if (!progress) {
      progress = await Progress.create({
        user: user._id,
        course: quiz.course,
        quizAttempts: [],
      });
    }

    progress.quizAttempts.push({
      quiz: quiz._id,
      score: result.score,
      total: result.total,
      passed,
    });
    progress.updatedAt = new Date();
    await progress.save();

    const certificate = await issueCertificateIfNeeded({
      userId: user._id,
      courseId: quiz.course,
      progress,
    });

    res.json({
      result,
      passed,
      certificate: certificate
        ? {
            id: certificate._id,
            grade: certificate.grade,
            score: certificate.score,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    if (quiz.chapter) {
      await Chapter.findByIdAndUpdate(quiz.chapter, { $unset: { quiz: "" } });
    }
    await quiz.remove();
    res.json({ message: "Quiz supprimé" });
  } catch (error) {
    next(error);
  }
};
