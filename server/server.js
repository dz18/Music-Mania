const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("API is running..."));

const users = require('./routes/users.js')
const auth = require('./routes/auth.js')
const musicbrainz = require('./routes/musicbrainz.js')
const reviews = require('./routes/reviews.js')

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/musicbrainz', musicbrainz)
app.use('/api/reviews', reviews)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})