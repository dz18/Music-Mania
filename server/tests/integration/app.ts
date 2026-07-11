import express from 'express'
import musicbrainz from '../../routes/musicbrainz'
import reviews from '../../routes/reviews'
import users from '../../routes/users'

const app = express()
app.use(express.json())

app.use('/api/musicbrainz', musicbrainz)
app.use('/api/reviews', reviews)
app.use('/api/users', users)

export default app
