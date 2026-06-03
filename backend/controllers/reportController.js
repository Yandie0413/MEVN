const Course = require("../models/Course");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");

exports.courseReport = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId).select(
      "chapters title",
    );
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    const totalChapters = course.chapters ? course.chapters.length : 0;
    const progresses = await Progress.find({ course: course._id });
    const totalUsers = progresses.length;

    let completionSum = 0;
    let scoreSum = 0;
    let scoreTotal = 0;

    progresses.forEach((progress) => {
      const completed = progress.completedChapters
        ? progress.completedChapters.length
        : 0;
      completionSum += totalChapters ? completed / totalChapters : 0;

      const progressScoreTotal = (progress.quizAttempts || []).reduce(
        (acc, attempt) => acc + (attempt.total || 0),
        0,
      );
      const progressScore = (progress.quizAttempts || []).reduce(
        (acc, attempt) => acc + (attempt.score || 0),
        0,
      );
      scoreSum += progressScore;
      scoreTotal += progressScoreTotal;
    });

    const certificateCount = await Certificate.countDocuments({
      course: course._id,
      status: "attribué",
    });

    res.json({
      courseId: course._id,
      courseTitle: course.title,
      totalChapters,
      totalUsers,
      averageCompletionRate:
        totalUsers > 0
          ? Math.round((completionSum / totalUsers) * 10000) / 100
          : 0,
      averageScore:
        scoreTotal > 0 ? Math.round((scoreSum / scoreTotal) * 10000) / 100 : 0,
      certificateCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.userReport = async (req, res, next) => {
  try {
    // Vérification de sécurité : Seul l'utilisateur concerné ou un admin peut voir ce rapport
    if (!req.user) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "Accès non autorisé à ce rapport" });
    }

    const progresses = await Progress.find({
      user: req.params.userId,
    }).populate("course");
    const certificates = await Certificate.find({
      user: req.params.userId,
    }).populate("course");

    const progressByCourse = progresses.map((progress) => {
      const totalChapters = progress.course?.chapters
        ? progress.course.chapters.length
        : 0;
      const completed = progress.completedChapters
        ? progress.completedChapters.length
        : 0;
      const completionRate = totalChapters ? completed / totalChapters : 0;
      const totalScore = (progress.quizAttempts || []).reduce(
        (acc, attempt) => acc + (attempt.score || 0),
        0,
      );
      const totalPossible = (progress.quizAttempts || []).reduce(
        (acc, attempt) => acc + (attempt.total || 0),
        0,
      );
      const averageScore = totalPossible ? totalScore / totalPossible : 0;

      return {
        courseId: progress.course?._id,
        courseTitle: progress.course?.title,
        completedChapters: completed,
        totalChapters,
        completionRate: Math.round(completionRate * 10000) / 100,
        averageScore: totalPossible
          ? Math.round((averageScore || 0) * 10000) / 100
          : 0,
        quizAttempts: progress.quizAttempts,
      };
    });

    res.json({
      userId: req.params.userId,
      progress: progressByCourse,
      certificates: certificates.map((certificate) => ({
        courseId: certificate.course?._id,
        courseTitle: certificate.course?.title,
        score: certificate.score,
        grade: certificate.grade,
        status: certificate.status,
      })),
    });
  } catch (error) {
    next(error);
  }
};
