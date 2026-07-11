import express from 'express'
import musicBrainzController from '../controllers/musicbrainz'
import validateQuery from '../middleware/verifyQuery'
import { 
    artistsSchema,
    discographySchema,
    discographySinglesSchema,
    findSingleIdSchema,
    getArtistsSchema,
    getReleaseSchema,
    getSongSchema,
    releasesSchema
} from '../schemas/musicbrainz.schema' 

const router = express.Router()

// Queries (no song query is intentional due to API Limitations)
router.get('/artists', validateQuery(artistsSchema), musicBrainzController.artists)
router.get('/releases', validateQuery(releasesSchema), musicBrainzController.releases)

// Individual Items
router.get('/getArtist', validateQuery(getArtistsSchema), musicBrainzController.getArtist)
router.get('/getRelease', validateQuery(getReleaseSchema), musicBrainzController.getRelease)
router.get('/getSong', validateQuery(getSongSchema), musicBrainzController.getSong)

// Artists Discography
router.get('/discography', validateQuery(discographySchema), musicBrainzController.discography)
router.get('/discographySingles', validateQuery(discographySinglesSchema), musicBrainzController.discographySingles)
router.get('/findSingleId', validateQuery(findSingleIdSchema), musicBrainzController.findSingleId)

export default router