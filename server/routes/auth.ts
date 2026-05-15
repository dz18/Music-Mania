import express from 'express'
const router = express.Router()
import authController from '../controllers/auth'

import { verifyUser } from '../middleware/auth'
import validateBody from '../middleware/verifyBody'
import validateQuery from '../middleware/verifyQuery'

import { 
    changePasswordSchema,
    confirmPasswordSchema,
    registerSchema, 
    signInSchema 
} from '../schemas/auth.schema'

// Public
router.post('/register', validateQuery(registerSchema), authController.register)
router.post('/sign-in', validateBody(signInSchema), authController.signIn)

// Private Actions
router.post('/confirmPassword', 
    verifyUser, 
    validateBody(confirmPasswordSchema),
    authController.confirmPassword
)
router.post('/changePassword', 
    verifyUser, 
    validateBody(changePasswordSchema),
    authController.changePassword
)

export default router