const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/", protect, restrictTo("admin"), courseController.createCourse);
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.put("/:id", protect, restrictTo("admin"), courseController.updateCourse);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  courseController.deleteCourse,
);

module.exports = router;
