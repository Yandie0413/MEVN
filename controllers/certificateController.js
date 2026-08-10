const Certificate = require('../models/Certificate')

// GET /api/certificates/me
const getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id })
            .populate('course', 'title titleEn category categoryEn bgColor iconColor')
            .sort({ issuedAt: -1 })
        res.json(certificates)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/certificates/:id
const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('course', 'title titleEn category categoryEn bgColor iconColor level levelEn')
            .populate('user', 'nom email')
        if (!certificate) return res.status(404).json({ message: 'Certificat introuvable' })
        if (certificate.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé' })
        }
        res.json(certificate)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

// GET /api/certificates/verify/:code (public, pour vérification externe)
const verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ code: req.params.code })
            .populate('course', 'title titleEn')
            .populate('user', 'nom')
        if (!certificate) return res.status(404).json({ message: 'Certificat introuvable ou invalide' })
        res.json(certificate)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
}

module.exports = { getMyCertificates, getCertificate, verifyCertificate }
