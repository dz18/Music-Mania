import express from 'express'
const router = express.Router()
import healthCheckController from '../controllers/healthcheck'

router.get('/', healthCheckController.healthCheck)

export default router 