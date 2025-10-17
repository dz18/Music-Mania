const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

// Gets all users
const getUsers = async (req, res) => {

  logApiCall(req.method, req.originalUrl)

  try {
    const users = await prisma.user.count()

    successApiCall(req.method, req.originalUrl)
    return res.json(users)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({error: 'Counting users failed.'})
  }
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
    // console.log('User data:', user)
    successApiCall(req.method, req.originalUrl)
    return res.json({
      username: user.username,
      email: user.email,
      id: user.id,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      favArtists: user.favArtists,
      favSongs: user.favSongs,
      favReleases: user.favReleases
    })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

// Get all favorites by user
const getFavorites = async (res, req) => {
  const { userId } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!userId) {
    errorApiCall(req.method, req.originalUrl, 'Missing Id')
    return
  }

  try {
    const favorites = prisma.user.findUnique({
      where: {id : userId},
      select: {
        favArtists: true,
        favRecordings: true,
        favReleases: true
      }
    })

    // console.log(favorites)
    successApiCall(req.method, req.originalUrl)
    res.json(favorites)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

// Add or remove a favorite
const favorite = async (req, res) => {
  const { id, userId, type, action } = req.body

  logApiCall(req.method, req.originalUrl)

  if (type !== 'release' && type !== 'artist' && type !== 'song') {
    errorApiCall(req.method, req.originalUrl, 'Missing Id')
    return res.status(400).json({error: 'Invalid type'})
  }

  if (action !== 'add' && action !== 'remove') {
    errorApiCall(req.method, req.originalUrl, 'Invalid action')
    return res.status(400).json({error: 'Invalid action'})
  }

  if (!id || !userId) {
    errorApiCall(req.method, req.originalUrl, 'Missing Id')
    return res.status(400).json({error: 'Missing id'})
  }

  try {
    const fieldMap = {
      release: 'favReleases',
      artist: 'favArtists',
      song: 'favSongs',
    }
    const field = fieldMap[type]

    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: { 
        favArtists: true,
        favReleases: true,
        favSongs: true
      }
    })

    console.log(`${field}:`, user[field].length)
    if (user[field].length >= 10) {
      errorApiCall(req.method, req.originalUrl, `${field} maxed out`)
      return res.status(400).json({error : 'Max amount of favorite artist reached. (10 Max)'})
    }

    if (user[field].includes(id) && type === 'add') {
      errorApiCall(req.method, req.originalUrl, `${field} already includes id`)
      return res.status(400).json({error : 'Artist already set as favorite'})
    }

    
    if (!user[field].includes(id) && type === 'remove') {
      errorApiCall(req.method, req.originalUrl, `${field} does not include the id`)
      return res.status(400).json({error : 'Artist already set as favorite'})
    }
    
    if (action === 'add') {
      await prisma.user.update({
        where: {id : userId},
        data: {
          [field]: [...(user[field]), id]
        }
      })
    }

    if (action === 'remove') {
      let fav = user[field].filter(f => f !== id)
      await prisma.user.update({
        where: {id : userId},
        data: {
          [field]: fav
        }
      })
    }

    successApiCall(req.method, req.originalUrl)
    return res.json({message: `Artist ${action}ed to favorites`})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
  
}

// Get a batch of users
const query = async (req, res) => {
  const { q } = req.query

  if (q.length === 0) {
    errorApiCall(req.method, req.originalUrl, 'Query term length 0')
    return res.status(400).json({error: 'Query term length 0'})
  }

  try {

    const query = await prisma.user.findMany({
      where: {
        username: {
          contains: q,
          mode: 'insensitive'
        }
      },
      select: {
        username: true,
        id: true,
        createdAt: true
      },
      take: 25
    })

    console.log(query.map(q => q))
    successApiCall(req.method, req.originalUrl)
    res.json(query)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

module.exports = {
  getUsers,
  findUserById,
  getFavorites,
  favorite,
  query
};