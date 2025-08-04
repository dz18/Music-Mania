const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
  const { 
    email, 
    username,
    password, 
    phoneNumber 
  } = req.body

  console.log('Starting registering process...')

  if (!email || !password) {
    console.error('Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    
    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { 
        email,
        username, 
        password: hashedPassword, 
        phone_number: phoneNumber || ''
      },
    })

    return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } })
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed' })
  }

} 

const login = async (req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    console.error('Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }
  
  try {
    console.log(`Attempting login into ${email}`)
    console.log(`pw: ${password}`)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid password' })

    console.log('Passwords match. Signing user in...')
    console.log(user)

    return res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    })
  } catch (err) {
    return res.status(500).json({ error: 'Signin failed' })
  }

}


module.exports = {
  register,
  login,
}