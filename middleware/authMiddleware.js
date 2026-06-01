const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if (!token){
            return res.status(401).json({message: 'Acces refusé, token manquant' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré' })
    }
}
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin'){
        return res.status(403).json({ message: 'Acces reservé aux administrateur'})
    }
    next()
}
const enseignantOnly = (req, res, next) => {
    if (req.user.role !== 'enseignant' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès reservé aux enseignant'})
    }
    next()
}
module.exports = { protect, adminOnly, enseignantOnly}