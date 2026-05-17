import express from 'express'
import userController from '../controllers/users'
import { verifyUser, softVerifyUser } from '../middleware/auth'
import multer from 'multer'
import validateQuery from '../middleware/verifyQuery'
import { 
  allFollowersSchema,
  checkLikeSchema,
  deleteLikeSchema,
  editSchema,
  followSchema,
  isFollowingSchema,
  likeSchema,
  likesSchema, 
  profileSchema,
  querySchema,
  reviewPanelSchema,
  unfollowSchema
} from '../schemas/user.schema'
import validateBody from '../middleware/verifyBody'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

// Public Use
router.get('/total', userController.getUserCount)
router.get('/query', validateQuery(querySchema), userController.query)

// Public User-specific
router.get('/likes', validateQuery(likesSchema), userController.getLikes)
router.get('/profile', validateQuery(profileSchema), softVerifyUser, userController.profile)
router.get('/allFollowers', validateQuery(allFollowersSchema), userController.allFollowers)
router.get('/follow', validateQuery(isFollowingSchema), userController.isFollowing)

// Private User-specific Data Retrievals
router.get('/find', verifyUser, userController.findUserById)
router.get('/edit', verifyUser, userController.editInfo) 
router.get('/review', verifyUser, validateQuery(reviewPanelSchema), userController.reviewPanel)
router.get('/like', verifyUser, validateQuery(checkLikeSchema), userController.checkLike)

// Prive User-specific Actions
router.patch('/edit', verifyUser, validateBody(editSchema), upload.single('avatar'), userController.edit)
router.post('/follow',  verifyUser, validateBody(followSchema), userController.follow)
router.post('/like', verifyUser, validateBody(likeSchema), userController.like)
router.delete('/unfollow', verifyUser, validateBody(unfollowSchema), userController.unfollow)
router.delete('/like', verifyUser, validateBody(deleteLikeSchema), userController.deleteLike)


export default router