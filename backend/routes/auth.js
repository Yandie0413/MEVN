const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/me", authController.me);

module.exports = router;
