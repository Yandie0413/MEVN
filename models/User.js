const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin','enseignant','etudiant'],
        default: 'etudiant'
    },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null }
},{timestamps: true })
module.exports = mongoose.model('User', UserSchema)