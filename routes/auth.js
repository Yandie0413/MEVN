const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const { protect, adminOnly } = require('../middleware/authMiddleware')
router.post('/register', register)
router.post('/login', login)
//routes  protégé
router.get('/profile', protect, (req, res) =>{
    res.json({ message: 'Bienvenue sur ton profil', user: req.user})
})
router.get('/admin', protect, adminOnly, (req, res) => {
    res.json({ message:'Bienvenue admin !'})
})

module.exports = router
