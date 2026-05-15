import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export async function verifyUser(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const header = req.headers.authorization 

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" })
  }

  const headers = header.split(" ")
  const token = headers[1]

  try {
    const user =  jwt.verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export async function softVerifyUser(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const header = req.headers.authorization

  if (!header?.startsWith("Bearer ")) {
    req.user = null
    return next()
  }

  const token = header.split(" ")[1]

  try {
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload
    req.user = user
  } catch {
    req.user = null
  }

  return next()
}
