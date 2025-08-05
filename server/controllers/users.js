const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

// Gets all users
const getUsers = async (req, res) => {
  res.send('getUsers')
}

// Find a user
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
    console.log('User data:', user)
    successApiCall(req.method, req.originalUrl)
    return res.json({
      username: user.username,
      email: user.email,
      id: user.id,
    })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

module.exports = {
  getUsers,
  findUserById,
};