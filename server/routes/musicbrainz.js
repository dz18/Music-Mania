const express = require('express')
const router = express.Router()
const musicBrainzController = require('../controllers/musicbrainz')

router.get('/artists', musicBrainzController.artists)
router.get('/recordings', musicBrainzController.recordings)
router.get('/releases', musicBrainzController.releases)
router.get('/getArtist', musicBrainzController.getArtist)

module.exports = router