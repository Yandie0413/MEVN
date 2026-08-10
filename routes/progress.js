const express = require('express')
const router = express.Router()
const { getMyProgress, getMyProgressForCourse } = require('../controllers/progressController')
const { protect } = require('../middleware/authMiddleware')

router.get('/me', protect, getMyProgress)
router.get('/me/:courseId', protect, getMyProgressForCourse)

module.exports = router
