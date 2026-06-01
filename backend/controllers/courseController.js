const Course = require("../models/Course");
const Chapter = require("../models/Chapter");

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("chapters");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("chapters");
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    await Chapter.deleteMany({ course: course._id });
    await course.remove();
    res.json({ message: "Cours et chapitres associés supprimés" });
  } catch (error) {
    next(error);
  }
};
