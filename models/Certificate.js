const mongoose = require('mongoose')

const idTransform = {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
    }
}

const CertificateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    code: { type: String, required: true, unique: true },
    score: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now }
}, { toJSON: idTransform, toObject: idTransform })

CertificateSchema.index({ user: 1, course: 1 }, { unique: true })

module.exports = mongoose.model('Certificate', CertificateSchema)
