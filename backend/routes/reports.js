const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, restrictTo } = require("../middleware/auth");

router.get(
  "/course/:courseId",
  protect,
  restrictTo("admin"),
  reportController.courseReport,
);
router.get("/user/:userId", protect, reportController.userReport);

module.exports = router;
