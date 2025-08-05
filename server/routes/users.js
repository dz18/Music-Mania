
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

// Returns all the users in the current db
router.get('/users', userController.getUsers)
router.get('/find', userController.findUserById)

module.exports = router