const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/", protect, restrictTo("admin"), chapterController.createChapter);
router.get("/", chapterController.getChapters);
router.get("/:id", chapterController.getChapterById);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  chapterController.updateChapter,
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  chapterController.deleteChapter,
);

module.exports = router;
