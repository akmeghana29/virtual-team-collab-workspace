const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const resourceRoutes = require('./routes/resources')

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/resources', resourceRoutes)

app.get('/', (req, res) => res.json({ message: 'VTCW Backend Running' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error('MongoDB connection error:', err))