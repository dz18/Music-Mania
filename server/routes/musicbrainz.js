const express = require('express')
const router = express.Router()
const musicBrainzController = require('../controllers/musicbrainz')

// Queries
router.get('/artists', musicBrainzController.artists)
router.get('/releases', musicBrainzController.releases)

// Individual Items
router.get('/getArtist', musicBrainzController.getArtist)
router.get('/getRelease', musicBrainzController.getRelease)
router.get('/getSong', musicBrainzController.getSong)

// Artists Discography
router.get('/discography', musicBrainzController.discography)
router.get('/discographySingles', musicBrainzController.discographySingles)
router.get('/findSingleId', musicBrainzController.findSingleId)

module.exports = router