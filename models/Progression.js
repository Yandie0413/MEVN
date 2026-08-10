const mongoose = require('mongoose')

const idTransform = {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
    }
}

const ProgressionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedChapters: [{ type: mongoose.Schema.Types.ObjectId }],
    quizScores: { type: Map, of: Number, default: {} },
    progressPercent: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date, default: null }
}, { timestamps: true, toJSON: idTransform, toObject: idTransform })

ProgressionSchema.index({ user: 1, course: 1 }, { unique: true })

module.exports = mongoose.model('Progression', ProgressionSchema)
