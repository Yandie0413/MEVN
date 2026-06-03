const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { protect } = require("../middleware/auth");

router.get("/", protect, progressController.getProgress);
router.post("/", protect, progressController.createOrUpdateProgress);
router.delete("/:id", protect, progressController.deleteProgress);

module.exports = router;
