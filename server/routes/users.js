
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router.get('/total', userController.getUsers)
router.get('/find', userController.findUserById)
router.get('/favorites', userController.getFavorites)
router.get('/query', userController.queryUsers)

router.patch('/favorite', userController.favorite)

module.exports = router