const crypto = require('crypto')
const Certificate = require('../models/Certificate')

// Émet un certificat si le cours vient d'atteindre 100% et qu'aucun certificat n'existe déjà
async function issueCertificateIfComplete(progression) {
    if (progression.progressPercent < 100) return null

    const existing = await Certificate.findOne({ user: progression.user, course: progression.course })
    if (existing) return existing

    if (!progression.completedAt) {
        progression.completedAt = new Date()
    }

    const scores = Array.from(progression.quizScores.values())
    const score = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 100

    const code = crypto.randomBytes(6).toString('hex').toUpperCase()
    return Certificate.create({
        user: progression.user,
        course: progression.course,
        code,
        score
    })
}

module.exports = { issueCertificateIfComplete }
