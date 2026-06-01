const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//INSCRIPTION
const register = async (req, res) => {
    try{
        const { nom, email, password, role } = req.body


//verifier si l'email existe deja 
       const userExiste = await User.findOne({email})
       if (userExiste) {
        return res.status(400).json({ message:'Cet email existe deja' })
       }
//hasher le mot de passe
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

//Creer l'utilisateur 
const user = await User.create({
    nom,
    email,
    password: hashedPassword,
    role
})

//créer le token JWT
 const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn:'7d'}
 )
 res.status(201).json({
    message: 'Inscription reussi',
    token,
    user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role
    }
 })

} catch (error) {
        res.status(500).json({ message: 'Erreur Serveur',error: error.message })
    }
}

//CONNEXION
const login = async (req, res) => {
    try{
        const { email, password } = req.body
//Verifier si l'utilisateur exite
const user = await User.findOne({ email })
if (!user) {
return res.status(400).json({ message: 'Email ou mot de passe incorect'})
}
const isMatch = await bcrypt.compare(password, user.password)
if (!isMatch) {
  return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
}
//Cree le token JWT
const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d'}
)
res.status(200).json({
    message: 'Connexion reussie',
    token,
    user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role

    }
})
    }catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message})
  }
}
module.exports = { register, login }