const Chapter = require("../models/Chapter");
const Course = require("../models/Course");

exports.createChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.create(req.body);
    await Course.findByIdAndUpdate(chapter.course, {
      $push: { chapters: chapter._id },
    });
    res.status(201).json(chapter);
  } catch (error) {
    next(error);
  }
};

exports.getChapters = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.courseId) {
      filter.course = req.query.courseId;
    }
    const chapters = await Chapter.find(filter).sort({ order: 1 });
    res.json(chapters);
  } catch (error) {
    next(error);
  }
};

exports.getChapterById = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate(
      "course quiz",
    );
    if (!chapter) {
      return res.status(404).json({ message: "Chapitre non trouvé. Tsy hita mihitsy eee" });
    }
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

exports.updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!chapter) {
      return res.status(404).json({ message: "Chapitre non trouvé. Tsy hita mihitsy eee" });
    }
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

exports.deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: "Chapitre non trouvé. Tsy hita mihitsy" });
    }
    await Course.findByIdAndUpdate(chapter.course, {
      $pull: { chapters: chapter._id },
    });
    await chapter.remove();
    res.json({ message: "Chapitre supprimé. Efa voafafa matoa tsy ao" });
  } catch (error) {
    next(error);
  }
};
