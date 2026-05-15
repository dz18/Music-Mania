import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { ParsedQs } from 'qs'

export default function validateQuery(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({ error: z.treeifyError(result.error) })
    }
    req.validatedQuery = result.data
    next()
  }
}