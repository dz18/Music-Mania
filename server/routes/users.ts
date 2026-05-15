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
router.get('/total', userController.getUsers)
router.get('/query', validateQuery(querySchema), userController.query)

// Public User-specific
router.get('/likes', validateQuery(likesSchema), userController.getLikes)
router.get('/profile', validateQuery(profileSchema), softVerifyUser, userController.profile)
router.get('/allFollowers', validateQuery(allFollowersSchema), userController.allFollowers)
router.get('/follow', validateQuery(isFollowingSchema), userController.isFollowing)

// Private User-specific Data Retrievals
router.get('/find', verifyUser, userController.findUserById)
router.get('/edit', verifyUser, userController.editInfo) 
router.get('/review', validateQuery(reviewPanelSchema), verifyUser, userController.reviewPanel)
router.get('/like', validateQuery(checkLikeSchema), verifyUser, userController.checkLike)

// Prive User-specific Actions
router.patch('/edit', validateBody(editSchema), verifyUser, upload.single('avatar'), userController.edit)
router.post('/follow', validateBody(followSchema), verifyUser, userController.follow)
router.post('/like', validateBody(likeSchema), verifyUser, userController.like)
router.delete('/unfollow', validateBody(unfollowSchema), verifyUser, userController.unfollow)
router.delete('/like', validateBody(deleteLikeSchema), verifyUser, userController.deleteLike)


export default router