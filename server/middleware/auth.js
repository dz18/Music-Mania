import jwt from "jsonwebtoken";

export async function verifyUser(req, res, next) {
  const header = req.headers.authorization 

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" })
  }

  const headers = header.split(" ")
  const token = headers[1]

  try {
    const user =  jwt.verify(token, process.env.NEXTAUTH_SECRET)
    console.log('ACCESS GRANTED: authenticated')
    req.user = user
    next()
  } catch (err) {
    
    console.log('DENIED ACCESS: unauthenticated')
    return res.status(401).json({ error: "Invalid token" })
  }
}
