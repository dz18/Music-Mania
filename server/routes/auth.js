const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { verifyUser } = require('../middleware/auth')

router.post('/register', authController.register)
router.post('/sign-in', authController.signIn)
router.post('/confirmPassword', verifyUser, authController.confirmPassword)
router.post('/changePassword', verifyUser, authController.changePassword)

module.exports = router