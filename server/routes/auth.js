const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', authController.register)
router.post('/sign-in', authController.signIn)

module.exports = router