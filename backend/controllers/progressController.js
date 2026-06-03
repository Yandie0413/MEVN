const Progress = require("../models/Progress");
const Chapter = require("../models/Chapter");
const User = require("../models/User");

exports.getProgress = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;
    if (req.query.courseId) filter.course = req.query.courseId;
    const progress = await Progress.find(filter).populate(
      "user course completedChapters quizAttempts.quiz",
    );
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateProgress = async (req, res, next) => {
  try {
    // Sécurité: On utilise l'ID du token protect, on ignore le body pour éviter l'usurpation
    const userId = req.user.id;
    const courseId = req.body.courseId?.toString();
    const chapterId = req.body.chapterId?.toString();

    if (!userId || !courseId || !chapterId) {
      return res
        .status(400)
        .json({ message: "userId, courseId et chapterId sont requis" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapitre non trouvé" });
    }

    if (chapter.course.toString() !== courseId.toString()) {
      return res
        .status(400)
        .json({ message: "Le chapitre n'appartient pas à ce cours" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: user._id, course: courseId },
      { $addToSet: { completedChapters: chapterId }, updatedAt: new Date() },
      { returnDocument: "after", upsert: true },
    );

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!progress) {
      return res.status(404).json({ message: "Progression non trouvée" });
    }
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: "Progression non trouvée" });
    }
    res.json({ message: "Progression supprimée" });
  } catch (error) {
    next(error);
  }
};
