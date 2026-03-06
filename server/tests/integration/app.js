const express = require('express')

const app = express()
app.use(express.json())

app.use('/api/musicbrainz', require('../../routes/musicbrainz'))
app.use('/api/reviews', require('../../routes/reviews'))
app.use('/api/users', require('../../routes/users'))

module.exports = app
