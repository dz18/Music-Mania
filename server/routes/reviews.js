const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')

router.get('/', reviewController.reviews)
router.get('/user', reviewController.user)

router.put('/', reviewController.publishOrDraft)

router.delete('/', reviewController.deleteReview)

module.exports = router