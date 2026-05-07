const express = require('express')
const router = express.Router()
const { landingStats } = require('../controllers/stats')

router.get('/landing', landingStats)

module.exports = router
