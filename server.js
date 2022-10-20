require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const db = require('./config/dbConnect')
const credentials = require('./middleware/credentials')
const { logger } = require('./middleware/logEvents')
const corsOptionsDelegate = require('./config/corsOptions')
const { errorHandler } = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const PORT = process.env.PORT || 5000

// Connect to MongoDB
db.connect()

// Built in middleware to resolve form data
app.use(express.urlencoded({ extended: false }))

// Built in middleware json
app.use(express.json())

// Middleware for cookie
app.use(cookieParser())

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

// Custom logger
app.use(logger)

// Router
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refreshToken', require('./routes/refreshToken'))
app.use('/logout', require('./routes/logout'))

// After this line, every route will be protected with jwt token
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

app.use(credentials)
app.use(cors(corsOptionsDelegate))
app.use(errorHandler)

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
