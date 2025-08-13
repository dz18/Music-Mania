const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

// Gets all users
const getUsers = async (req, res) => {
  res.send('getUsers')
}

const preview = async (req, res) => {
  const { userId } = req.query
  
  logApiCall(req.method, req.originalUrl)

  if (!userId) {
    errorApiCall(req.method, req.originalUrl, 'Missing userId')
    res.status(400).json({error: 'Missing UserId'})
  }

  try {
    const user = await prisma.user.findUnique({
      where: {id : userId},
      omit: {
        password: true,
        email: true,
        phoneNumber: true,
      }
    })

    if (!user) console.log('User not found')

    console.log('User found')
    console.log(user)
    res.json(user)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    res.status(400).json({error : 'Error fetching preview for user'})
  }
}

// Find a user by Id
// ONLY USE FOR AUTH
const findUserById = async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    errorApiCall(req.method, req.originalUrl, 'Missing userId parameter')
    return res.status(400).json({error: 'Missing userId parameter.'})
  }

  try {
    
    logApiCall(req.method, req.originalUrl)

    const user = await prisma.user.findUnique({
      where: { 
        id: userId
      }
    })

    if (!user) {
      errorApiCall(req.method, req.originalUrl, 'User does not exist')
      return res.status(400).json({error: 'User does not exist.'})
    }

    console.log('User found. Returning JSON object of users info.')
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      role: user.role
    }
    console.log('User data:', data)
    successApiCall(req.method, req.originalUrl)
    return res.json(data)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

module.exports = {
  getUsers,
  findUserById,
  preview
};