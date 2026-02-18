
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyUser } = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

// Public Use
router.get('/total', userController.getUsers)
router.get('/query', userController.query)

// Public User-specific
router.get('/likes', userController.getLikes)
router.get('/profile', userController.profile)
router.get('/allFollowers', userController.allFollowers)
router.get('/follow', userController.isFollowing)

// Private User-specific
router.get('/find', verifyUser, userController.findUserById)
router.get('/edit', verifyUser, userController.editInfo)
router.get('/review', verifyUser, userController.reviewPanel)

// Actions
router.post('/follow', verifyUser, userController.follow)
router.post('/like', verifyUser, userController.like)
router.delete('/unfollow', verifyUser, userController.unfollow)
router.delete('/like', verifyUser, userController.deleteLike)
router.patch('/edit', verifyUser, upload.single('avatar'), userController.edit)


module.exports = router