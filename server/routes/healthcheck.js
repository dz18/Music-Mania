const express = require('express')
const router = express.Router()
const healthCheckController = require('../controllers/healthcheck.js')

router.get('/', healthCheckController.healthCheck)

module.exports = router 