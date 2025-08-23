const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')

router.get('/', reviewController.reviews)

module.exports = router