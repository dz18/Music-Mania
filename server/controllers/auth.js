const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

const register = async (req, res) => {
  const {
    email,
    username,
    password,
  } = req.body

  logApiCall(req)

  if (!email || !username || !password) {
    errorApiCall(req, 'Missing required fields')
    return res.status(400).json({ error: 'Email, username, and password are required' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    const existingUsername = await prisma.user.findUnique({ where: { username } })

    if (existingUser || existingUsername) {
      errorApiCall(req, 'Email or username already in use')
      return res.status(409).json({ error: {
        email: existingUser ? 'Email already in use' : null,
        username: existingUsername ? 'Username already in use' : null,
      } })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'USER'
      },
    })

    successApiCall(req)
    return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Registration failed' })
  }

}

const signIn = async (req, res) => {
  console.log('1. signing-in...')
  const {email, password} = req.body

  logApiCall(req)

  if (!email || !password) {
    errorApiCall(req, 'Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    console.log('2. finding user ...')
    console.log('2. finding user ...')

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      errorApiCall(req, 'User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('3. Checking passwords')
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      errorApiCall(req, 'Invalid password')
      return res.status(401).json({ error: 'Invalid password' })
    }

    successApiCall(req)

    console.log({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    })

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Sign-in failed' })
  }

}

const confirmPassword = async (req, res) => {
  const { email, password } = req.body

  logApiCall(req)

  if (!email || !password) {
    errorApiCall(req, 'Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true }
    })

    if (!user) {
      errorApiCall(req, 'User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      errorApiCall(req, 'Invalid password')
      return res.status(401).json({ error: 'Invalid password' })
    }

    successApiCall(req)
    return res.json({ success: true })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Password confirmation failed' })
  }

}

const changePassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body

  logApiCall(req)

  if (!email || !newPassword || !confirmNewPassword) {
    errorApiCall(req, 'Missing required fields')
    return res.status(400).json({ error: 'Email, new password, and confirmation are required' })
  }

  if (newPassword !== confirmNewPassword) {
    errorApiCall(req, 'Passwords do not match')
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    successApiCall(req)
    return res.json({ success: true })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Password change failed' })
  }
}

module.exports = {
  register,
  signIn,
  confirmPassword,
  changePassword
}
