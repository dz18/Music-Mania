import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import users from './routes/users.js'
import auth from './routes/auth.js'
import musicbrainz from './routes/musicbrainz.js'
import reviews from './routes/reviews.js'
import stats from './routes/stats.js'
import health from './routes/healthcheck.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("API is running..."))

app.use('/api/musicbrainz', musicbrainz)
app.use('/api/auth', auth)
app.use('/api/reviews', reviews)
app.use('/api/users', users)
app.use('/api/stats', stats)
app.use('/api/health', health)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})