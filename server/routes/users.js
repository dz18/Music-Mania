
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router.get('/total', userController.getUsers)
router.get('/find', userController.findUserById)
router.get('/favorites', userController.getFavorites)
router.get('/query', userController.query)
router.get('/profile', userController.profile)

router.get('/follow', userController.isFollowing)
router.get('/countFollow', userController.countFollow)
router.get('/allFollowers', userController.allFollowers)
router.post('/follow', userController.follow)
router.delete('/follow', userController.unfollow)

router.patch('/favorite', userController.favorite)

module.exports = router