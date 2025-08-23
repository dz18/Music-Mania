const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

// Gets all users
const getUsers = async (req, res) => {
  try {

  } catch (error) {

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
      favArtists: user.favArtists
    })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

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

    console.log(favorites)
    successApiCall(req.method, req.originalUrl)
    res.json(favorites)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const addFavoriteArtist = async (req, res) => {
  const { artistId, userId } = req.body

  logApiCall(req.method, req.originalUrl)

  if (!artistId || !userId) {
    errorApiCall(req.method, req.originalUrl, 'Missing Id')
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: { favArtists: true }
    })

    if (user.favArtists.length === 10) {
      return res.status(400).json({error : 'Max amount of favorite artist reached. (10 Max)'})
    }

    if (user.favArtists.includes(artistId)) {
      return res.status(400).json({error : 'Artist already set as favorite'})
    }

    await prisma.user.update({
      where: {id : userId},
      data: {
        favArtists: [...user.favArtists, artistId]
      }
    })

    successApiCall(req.method, req.originalUrl)
    return res.json({message: 'Artist added to favorites'})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
  
}

const removeFavoriteArtist = async (req, res) => {
  const { userId, artistId } = req.body

  logApiCall(req.method, req.originalUrl)

  if (!userId || !artistId) {
    errorApiCall(req.method, req.originalUrl, 'Missing parameters')
    return
  }

  try {
    
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: { favArtists: true }
    })

    if (user.favArtists.length === 10) {
      return res.status(400).json({error : 'Max amount of favorite artist reached. (10 Max)'})
    }

    if (!user.favArtists.includes(artistId)) {
      return res.status(400).json({error : 'Artist not set as Favorite'})
    }

    let favArtists = user.favArtists.filter(id => id !== artistId)
    console.log(favArtists)
    await prisma.user.update({
      where: {id : userId},
      data: {
        favArtists: favArtists
      }
    })

    successApiCall(req.method, req.originalUrl)
    return res.json({message: 'Removed Artist Successfully.'})

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

module.exports = {
  getUsers,
  findUserById,
  addFavoriteArtist,
  getFavorites,
  removeFavoriteArtist
};