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

  logApiCall(req)

  if (!email || !password) {
    errorApiCall(req, 'Missing email or password')
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      errorApiCall(req, 'Email already in use')
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      errorApiCall(req, 'Username already in use')
    }

    let existingPhoneNumber
    if (phoneNumber) {
      existingPhoneNumber = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } })
      if (existingPhoneNumber) {
        errorApiCall(req, 'Phone Number already in use')
      }
    }

    if (existingUser || existingUsername || existingPhoneNumber) {
      errorApiCall(req, 'Username already in use')
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

    successApiCall(req)
    return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'registering account failed' })
  }

} 

const signIn = async (req, res) => {
  const {email, password} = req.body

  logApiCall(req)

  if (!email || !password) {
    errorApiCall(req, 'Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }
  
  try {
    console.log(`Attempting Sign In into ${email}`)
    console.log(`pw: ${password}`)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      errorApiCall(req, 'User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      errorApiCall(req, 'Invalid password')
      return res.status(401).json({ error: 'Invalid password' })
    }

    console.log('Passwords match. Signing user in...')

    successApiCall(req)
    return res.json({ 
      id: user.id, 
      email: user.email ,
      username: user.username,
    })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Signin failed' })
  }

}

const confirmPassword = async (req, res) => {

  try {
    const {email, password} = req.body

    logApiCall(req)
    const user = await prisma.user.findUnique({ 
      where: { email }, 
      select: { password: true }
    })
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      errorApiCall(req, 'Invalid password')
      return res.status(401).json({ error: 'Invalid password' })
    }

    res.json({success: true})

    successApiCall(req)
  } catch (error) {
    errorApiCall(req, error)
  }

}

const changePassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body
  
  logApiCall(req)

  try {

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ 
      where: { email },
      data: {
        password: hashedPassword
      }
    })

    res.json()

    successApiCall(req)
  } catch (error) {
    console.error(req, error)
  }
}

module.exports = {
  register,
  signIn,
  confirmPassword,
  changePassword
}