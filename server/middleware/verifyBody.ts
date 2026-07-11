import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

export default function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Invalid Request' })
    }
    req.validatedBody = result.data
    next()
  }
}