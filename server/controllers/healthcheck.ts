import { Request, Response } from 'express'

const healthCheck = async (req: Request, res: Response) => {
  res.status(200).send('ok')
}

export default { healthCheck }