
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyUser } = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.get('/total', userController.getUsers)
router.get('/find', verifyUser, userController.findUserById)
router.get('/favorites', userController.getFavorites)
router.get('/query', userController.query)
router.get('/profile', userController.profile)
router.get('/edit', verifyUser, userController.editInfo) // Edit
router.get('/follow', userController.isFollowing)
router.get('/countFollow', userController.countFollow)
router.get('/allFollowers', userController.allFollowers)

// Get the user info for the review panel component (review & like status)
router.get('/review', verifyUser, userController.reviewPanel) 

router.post('/follow', userController.follow)
router.post('/like', verifyUser, userController.like)

router.delete('/follow', userController.unfollow)
router.delete('/like', verifyUser, userController.deleteLike)

router.patch('/favorite', userController.favorite)
router.patch('/edit', verifyUser, upload.single('avatar'), userController.edit)

module.exports = router