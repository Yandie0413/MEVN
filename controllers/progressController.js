const Course = require('../models/Course')
const Progression = require('../models/Progression')
const { issueCertificateIfComplete } = require('../utils/certify')
const { bumpStreak } = require('../utils/streak')

function recalcProgress(progression, course) {
    const total = course.chapters.length
    progression.progressPercent = total > 0 ? Math.round((progression.completedChapters.length / total) * 100) : 0
    progression.xpEarned = progression.completedChapters.length * 100
}

async function findOrCreateProgression(userId, courseId) {
    let progression = await Progression.findOne({ user: userId, course: courseId })
    if (!progression) {
        progression = await Progression.create({ user: userId, course: courseId })
    }
    return progression
}

// POST /api/courses/:id/enroll
const enroll = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })

        const progression = await Progression.findOneAndUpdate(
            { user: req.user.id, course: course._id },
            { $setOnInsert: { user: req.user.id, course: course._id } },
            { upsert: true, new: true }
        )
        res.status(201).json(progression)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// POST /api/courses/:id/chapters/:chapterId/complete  (chapitres texte/vidéo)
const completeChapter = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        const chapter = course.chapters.id(req.params.chapterId)
        if (!chapter) return res.status(404).json({ message: 'Chapitre introuvable' })
        if (chapter.type === 'quiz') {
            return res.status(400).json({ message: 'Ce chapitre nécessite de soumettre le quiz pour être validé' })
        }

        const progression = await findOrCreateProgression(req.user.id, course._id)
        const already = progression.completedChapters.some(id => id.toString() === chapter._id.toString())
        if (!already) {
            progression.completedChapters.push(chapter._id)
        }
        recalcProgress(progression, course)
        const certificate = await issueCertificateIfComplete(progression)
        await progression.save()
        await bumpStreak(req.user.id)

        res.json({ progression, certificate })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// POST /api/courses/:id/chapters/:chapterId/quiz/submit  (correction automatique)
const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body // [{ questionId, optionId }]
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        const chapter = course.chapters.id(req.params.chapterId)
        if (!chapter || chapter.type !== 'quiz') {
            return res.status(400).json({ message: 'Chapitre quiz introuvable' })
        }

        let correctCount = 0
        const results = chapter.quizQuestions.map(q => {
            const submitted = Array.isArray(answers) ? answers.find(a => a.questionId === q._id.toString()) : null
            const correctOption = q.options.find(o => o.isCorrect)
            const correctOptionId = correctOption?._id?.toString() || null
            const isCorrect = !!submitted && submitted.optionId === correctOptionId
            if (isCorrect) correctCount++
            return {
                questionId: q._id.toString(),
                submittedOptionId: submitted?.optionId || null,
                correctOptionId,
                isCorrect,
                explanation: q.explanation
            }
        })

        const total = chapter.quizQuestions.length
        const score = total > 0 ? Math.round((correctCount / total) * 100) : 0

        const progression = await findOrCreateProgression(req.user.id, course._id)
        progression.quizScores.set(chapter._id.toString(), score)
        if (score >= 50) {
            const already = progression.completedChapters.some(id => id.toString() === chapter._id.toString())
            if (!already) progression.completedChapters.push(chapter._id)
        }
        recalcProgress(progression, course)
        const certificate = await issueCertificateIfComplete(progression)
        await progression.save()
        await bumpStreak(req.user.id)

        res.json({ score, correctCount, total, results, progression, certificate })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/progress/me
const getMyProgress = async (req, res) => {
    try {
        const progressions = await Progression.find({ user: req.user.id })
            .populate('course', 'title titleEn category categoryEn bgColor iconColor')
        res.json(progressions)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/progress/me/:courseId
const getMyProgressForCourse = async (req, res) => {
    try {
        const progression = await Progression.findOne({ user: req.user.id, course: req.params.courseId })
        if (!progression) return res.status(404).json({ message: 'Aucune progression pour ce cours' })
        res.json(progression)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

module.exports = {
    enroll,
    completeChapter,
    submitQuiz,
    getMyProgress,
    getMyProgressForCourse
}
