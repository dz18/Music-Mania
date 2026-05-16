import { Request, Response } from 'express'
import prisma from '../prisma/client'

const healthCheck = async (req: Request, res: Response) => {
  res.status(200).send('ok')
}

const databaseCheck = async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'connected' })
    } catch (error) {
        res.status(503).json({ status: 'disconnected' })
    }
}

export default { 
    healthCheck, 
    databaseCheck 
}