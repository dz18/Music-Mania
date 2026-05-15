import express from 'express'
import userController from '../controllers/users'
import { verifyUser, softVerifyUser } from '../middleware/auth'
import multer from 'multer'
import validateQuery from '../middleware/verifyQuery'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

// Public Use
router.get('/total', userController.getUsers)
router.get('/query', userController.query)

// Public User-specific
router.get('/likes', userController.getLikes)
router.get('/profile', softVerifyUser, userController.profile)
router.get('/allFollowers', userController.allFollowers)
router.get('/follow', userController.isFollowing)

// Private User-specific Data Retrievals
router.get('/find', verifyUser, userController.findUserById)
router.get('/edit', verifyUser, userController.editInfo) 
router.get('/review', verifyUser, userController.reviewPanel)
router.get('/like', verifyUser, userController.checkLike)

// Prive User-specific Actions
router.patch('/edit', verifyUser, upload.single('avatar'), userController.edit)
router.post('/follow', verifyUser, userController.follow)
router.post('/like', verifyUser, userController.like)
router.delete('/unfollow', verifyUser, userController.unfollow)
router.delete('/like', verifyUser, userController.deleteLike)


export default router