const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", userController.createUser);
router.get("/:id", authMiddleware.requireAuth, userController.getUserById);

module.exports = router;
