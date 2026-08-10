const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
dotenv.config()

connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/progress', require('./routes/progress'))
app.use('/api/certificates', require('./routes/certificates'))
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Serveur demarré sur le port ${PORT}`)
})