const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/course/:courseId", reportController.courseReport);
router.get("/user/:userId", reportController.userReport);

module.exports = router;
