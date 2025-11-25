const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')

router.get('/artist', reviewController.artistReviews)
router.get('/release', reviewController.releaseReviews)
router.get('/song', reviewController.songReviews)
router.get('/user', reviewController.user)
router.get('/:type/:id/itemRatings', reviewController.itemRatings)

router.put('/', reviewController.publishOrDraft)

router.delete('/', reviewController.deleteReview)

module.exports = router