const mongoose = require('mongoose')

const idTransform = {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
    }
}

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    textEn: { type: String, default: '' },
    isCorrect: { type: Boolean, default: false }
}, { toJSON: idTransform, toObject: idTransform })

const QuizQuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    textEn: { type: String, default: '' },
    options: { type: [OptionSchema], validate: v => v.length >= 2 },
    explanation: { type: String, default: '' },
    explanationEn: { type: String, default: '' }
}, { toJSON: idTransform, toObject: idTransform })

const ChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleEn: { type: String, default: '' },
    type: { type: String, enum: ['video', 'text', 'quiz', 'markdown'], default: 'text' },
    duration: { type: String, default: '10 min' },
    content: { type: String, default: '' },
    contentEn: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    quizQuestions: { type: [QuizQuestionSchema], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true, toJSON: idTransform, toObject: idTransform })

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    titleEn: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    categoryEn: { type: String, default: '' },
    description: { type: String, required: true },
    descriptionEn: { type: String, default: '' },
    level: { type: String, default: 'Niveau débutant' },
    levelEn: { type: String, default: 'Beginner level' },
    bgColor: { type: String, default: 'bg-edu-lavender' },
    iconColor: { type: String, default: '#7c3aed' },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    xp: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: true },
    chapters: { type: [ChapterSchema], default: [] }
}, { timestamps: true, toJSON: idTransform, toObject: idTransform })

module.exports = mongoose.model('Course', CourseSchema)
