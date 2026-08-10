const Course = require('../models/Course')
const Progression = require('../models/Progression')
const Certificate = require('../models/Certificate')

function isOwner(course, user) {
    if (!user) return false
    return user.role === 'admin' || course.teacher.toString() === user.id
}

// Fusionne la progression de l'utilisateur courant dans l'objet cours sérialisé
function mergeProgress(courseObj, progression) {
    const completedIds = new Set((progression?.completedChapters || []).map(id => id.toString()))
    courseObj.chapters.forEach(ch => {
        ch.completed = completedIds.has(ch.id)
    })
    const total = courseObj.chapters.length
    courseObj.progress = total > 0 ? Math.round((completedIds.size / total) * 100) : 0
    courseObj.enrolled = !!progression
}

// GET /api/courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ published: true }).sort({ createdAt: -1 })

        const [studentCounts, myProgressions] = await Promise.all([
            Progression.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]),
            req.user ? Progression.find({ user: req.user.id }) : Promise.resolve([])
        ])
        const countByCourse = Object.fromEntries(studentCounts.map(c => [c._id.toString(), c.count]))
        const progressionByCourse = Object.fromEntries(myProgressions.map(p => [p.course.toString(), p]))

        const result = courses.map(c => {
            const obj = c.toJSON()
            obj.students = countByCourse[obj.id] || 0
            mergeProgress(obj, progressionByCourse[obj.id])
            return obj
        })

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/courses/:id
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })

        const [studentsCount, progression] = await Promise.all([
            Progression.countDocuments({ course: course._id }),
            req.user ? Progression.findOne({ user: req.user.id, course: course._id }) : Promise.resolve(null)
        ])

        const obj = course.toJSON()
        obj.students = studentsCount
        obj.isOwner = isOwner(course, req.user)
        mergeProgress(obj, progression)

        res.json(obj)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/courses/mine/teaching
const getMyTeachingCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.user.id }).sort({ createdAt: -1 })
        res.json(courses)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// POST /api/courses
const createCourse = async (req, res) => {
    try {
        const { title, titleEn, category, categoryEn, description, descriptionEn, level, levelEn, bgColor, iconColor, rating, chapters } = req.body
        if (!title || !category || !description) {
            return res.status(400).json({ message: 'Titre, catégorie et description sont requis' })
        }
        const course = await Course.create({
            title, titleEn, category, categoryEn, description, descriptionEn,
            level, levelEn, bgColor, iconColor, rating,
            chapters: chapters || [],
            teacher: req.user.id
        })
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// PUT /api/courses/:id
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        if (!isOwner(course, req.user)) return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres cours' })

        const fields = ['title', 'titleEn', 'category', 'categoryEn', 'description', 'descriptionEn', 'level', 'levelEn', 'bgColor', 'iconColor', 'rating', 'published']
        fields.forEach(f => {
            if (req.body[f] !== undefined) course[f] = req.body[f]
        })
        await course.save()
        res.json(course)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        if (!isOwner(course, req.user)) return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres cours' })

        await Promise.all([
            course.deleteOne(),
            Progression.deleteMany({ course: course._id }),
            Certificate.deleteMany({ course: course._id })
        ])
        res.json({ message: 'Cours supprimé' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// POST /api/courses/:id/chapters
const addChapter = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        if (!isOwner(course, req.user)) return res.status(403).json({ message: 'Accès refusé' })

        course.chapters.push(req.body)
        await course.save()
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// PUT /api/courses/:id/chapters/:chapterId
const updateChapter = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        if (!isOwner(course, req.user)) return res.status(403).json({ message: 'Accès refusé' })

        const chapter = course.chapters.id(req.params.chapterId)
        if (!chapter) return res.status(404).json({ message: 'Chapitre introuvable' })

        const fields = ['title', 'titleEn', 'type', 'duration', 'content', 'contentEn', 'videoUrl', 'quizQuestions', 'order']
        fields.forEach(f => {
            if (req.body[f] !== undefined) chapter[f] = req.body[f]
        })
        await course.save()
        res.json(course)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// DELETE /api/courses/:id/chapters/:chapterId
const deleteChapter = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'Cours introuvable' })
        if (!isOwner(course, req.user)) return res.status(403).json({ message: 'Accès refusé' })

        const chapter = course.chapters.id(req.params.chapterId)
        if (!chapter) return res.status(404).json({ message: 'Chapitre introuvable' })
        chapter.deleteOne()
        await course.save()
        res.json(course)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

module.exports = {
    getCourses,
    getCourse,
    getMyTeachingCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    addChapter,
    updateChapter,
    deleteChapter
}
