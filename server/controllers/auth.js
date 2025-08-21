const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

const register = async (req, res) => {
  const { 
    email, 
    username,
    password, 
    phoneNumber 
  } = req.body

  logApiCall(req.method, req.originalUrl)

  if (!email || !password) {
    errorApiCall(req.method, req.originalUrl, 'Missing email or password')
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      errorApiCall(req.method, req.originalUrl, 'Email already in use')
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      errorApiCall(req.method, req.originalUrl, 'Username already in use')
    }

    let existingPhoneNumber
    if (phoneNumber) {
      existingPhoneNumber = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } })
      if (existingPhoneNumber) {
        errorApiCall(req.method, req.originalUrl, 'Phone Number already in use')
      }
    }

    if (existingUser || existingUsername || existingPhoneNumber) {
      errorApiCall(req.method, req.originalUrl, 'Username already in use')
      return res.status(409).json({ error: {
        email : existingUser ? 'Email already in use' : null,
        username : existingUsername ? 'Username already in use' : null,
        phoneNumber : existingPhoneNumber ? 'Phone Number already in use' : null
      } })
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { 
        email,
        username, 
        password: hashedPassword, 
        phoneNumber: phoneNumber || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'USER'
      },
    })

    successApiCall(req.method, req.originalUrl)
    return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({ error: 'registering account failed' })
  }

} 

const signIn = async (req, res) => {
  const {email, password} = req.body

  logApiCall(req.method, req.originalUrl)

  if (!email || !password) {
    errorApiCall(req.method, req.originalUrl, 'Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }
  
  try {
    console.log(`Attempting Sign In into ${email}`)
    console.log(`pw: ${password}`)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      errorApiCall(req.method, req.originalUrl, 'User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      errorApiCall(req.method, req.originalUrl, 'Invalid password')
      return res.status(401).json({ error: 'Invalid password' })
    }

    console.log('Passwords match. Signing user in...')

    successApiCall(req.method, req.originalUrl)
    return res.json({ 
      id: user.id, 
      email: user.email ,
      username: user.username,
    })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({ error: 'Signin failed' })
  }

}


module.exports = {
  register,
  signIn,
}