import express from 'express'
const router = express.Router()
import { landingStats } from '../controllers/stats'

router.get('/landing', landingStats)

export default router
