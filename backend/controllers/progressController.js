const Progress = require("../models/Progress");
const Chapter = require("../models/Chapter");

exports.getProgress = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.courseId) filter.course = req.query.courseId;
    const progress = await Progress.find(filter).populate(
      "course completedChapters quizAttempts.quiz",
    );
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateProgress = async (req, res, next) => {
  try {
    const { userId, courseId, chapterId } = req.body;
    if (!userId || !courseId || !chapterId) {
      return res
        .status(400)
        .json({ message: "userId, courseId et chapterId sont requis" });
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
      { userId, course: courseId },
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
