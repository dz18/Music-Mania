const express = require('express')
const router = express.Router()
const musicBrainzController = require('../controllers/musicbrainz')

router.get('/artists', musicBrainzController.artists)
router.get('/releases', musicBrainzController.releases)
router.get('/getArtist', musicBrainzController.getArtist)
router.get('/discography', musicBrainzController.discography)
router.get('/discographySingles', musicBrainzController.discographySingles)
router.get('/getRelease', musicBrainzController.getRelease)
router.get('/getSong', musicBrainzController.getSong)
router.get('/findSingleId', musicBrainzController.findSingleId)

module.exports = router