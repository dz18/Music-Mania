const prisma = require('../prisma/client')

// Gets all users
const getUsers = async (req, res) => {
  res.send('getUsers')
}

// Find a user
const findUserById = async (req, res) => {
  const { userId } = req.query

  try {
    console.log(`Starting search for user ID: ${userId}`)

    const user = prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.error('User does not exist')
      return res.status(400).json({error: 'User does not exist.'})
    }

    console.log('User found. Returning JSON object of users info.')
    console.log('User data:', user)
    return res.json({
      username: user.username,
      email: user.email,
      id: user.id,
    })
  } catch (error) {
    console.error('Error finding user by ID')
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

module.exports = {
  getUsers,
  findUserById,
};