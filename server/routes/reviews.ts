import express from 'express'
import reviewController from '../controllers/reviews'
import { verifyUser } from '../middleware/auth'
import validateQuery from '../middleware/verifyQuery'
import validateBody from '../middleware/verifyBody'
import { 
    artistReviewsSchema, 
    deleteReviewSchema, 
    publishOrDraftSchema, 
    releaseReviewsSchema, 
    songReviewsSchema, 
    userArtistsSchema, 
    userReleasesSchema, 
    userReviewSchema, 
    userSongsSchema 
} from '../schemas/reviews.schema'

const router = express.Router()
// All Reviews for ...
router.get('/artist', validateQuery(artistReviewsSchema), reviewController.artistReviews)
router.get('/release', validateQuery(releaseReviewsSchema), reviewController.releaseReviews)
router.get('/song', validateQuery(songReviewsSchema), reviewController.songReviews)

// Public User-specific
router.get('/user', validateQuery(userReviewSchema), reviewController.user)
router.get('/user/artists', validateQuery(userArtistsSchema), reviewController.userArtists)
router.get('/user/releases', validateQuery(userReleasesSchema), reviewController.userReleases)
router.get('/user/songs', validateQuery(userSongsSchema), reviewController.userSongs)

// User actions
router.put('/', verifyUser, validateBody(publishOrDraftSchema), reviewController.publishOrDraft)
router.delete('/', verifyUser, validateBody(deleteReviewSchema), reviewController.deleteReview)

export default router