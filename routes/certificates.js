const express = require('express')
const router = express.Router()
const { getMyCertificates, getCertificate, verifyCertificate } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.get('/me', protect, getMyCertificates)
router.get('/verify/:code', verifyCertificate)
router.get('/:id', protect, getCertificate)

module.exports = router
