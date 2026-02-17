const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')
const { verifyUser } = require('../middleware/auth')


router.get('/artist', reviewController.artistReviews)
router.get('/release', reviewController.releaseReviews)
router.get('/song', reviewController.songReviews)
router.get('/user', reviewController.user)
router.get('/user/artists', reviewController.userArtists)
router.get('/user/releases', reviewController.userReleases)
router.get('/user/songs', reviewController.userSongs)
router.get('/:type/:id/itemRatings', reviewController.itemRatings)

router.put('/', verifyUser,reviewController.publishOrDraft)

router.delete('/', verifyUser, reviewController.deleteReview)

module.exports = router