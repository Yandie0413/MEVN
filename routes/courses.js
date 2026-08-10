const express = require('express')
const router = express.Router()
const {
    getCourses,
    getCourse,
    getMyTeachingCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    addChapter,
    updateChapter,
    deleteChapter
} = require('../controllers/courseController')
const { enroll, completeChapter, submitQuiz } = require('../controllers/progressController')
const { protect, protectOptional, enseignantOnly } = require('../middleware/authMiddleware')

router.get('/', protectOptional, getCourses)
router.get('/mine/teaching', protect, enseignantOnly, getMyTeachingCourses)
router.get('/:id', protectOptional, getCourse)

router.post('/', protect, enseignantOnly, createCourse)
router.put('/:id', protect, enseignantOnly, updateCourse)
router.delete('/:id', protect, enseignantOnly, deleteCourse)

router.post('/:id/chapters', protect, enseignantOnly, addChapter)
router.put('/:id/chapters/:chapterId', protect, enseignantOnly, updateChapter)
router.delete('/:id/chapters/:chapterId', protect, enseignantOnly, deleteChapter)

router.post('/:id/enroll', protect, enroll)
router.post('/:id/chapters/:chapterId/complete', protect, completeChapter)
router.post('/:id/chapters/:chapterId/quiz/submit', protect, submitQuiz)

module.exports = router
