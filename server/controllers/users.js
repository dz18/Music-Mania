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
      },
      include: {
        favArtists: true,
        favReleases: true,
        favSongs: true
      }
    })

    if (!user) {
      errorApiCall(req.method, req.originalUrl, 'User does not exist')
      return res.status(400).json({error: 'User does not exist.'})
    }
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
  const { id, name, title, artistCredit, since, userId, type, action, coverArt } = req.body

  logApiCall(req.method, req.originalUrl)

  if (type !== 'release' && type !== 'artist' && type !== 'song') {
    errorApiCall(req.method, req.originalUrl, 'Invalid type')
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

    if (user[field].includes(id) && type === 'add') {
      errorApiCall(req.method, req.originalUrl, `${field} already includes id`)
      return res.status(400).json({error : 'Artist already set as favorite'})
    }

    
    if (!user[field].includes(id) && type === 'remove') {
      errorApiCall(req.method, req.originalUrl, `${field} does not include the id`)
      return res.status(400).json({error : 'Artist already set as favorite'})
    }

    if (type === 'artist') {
      await prisma.artist.upsert({
        where: { id },
        update: {},
        create: { id, name }
      })

      if (action === 'add') {
        await prisma.userFavArtist.create({
          data: { userId, artistId: id, since }
        })
      } else if (action === 'remove') {
        await prisma.userFavArtist.delete({
          where: {
            userId_artistId: { userId, artistId: id }
          }
        })
      }
    } else if (type === 'release') {
      await prisma.release.upsert({
        where: { id },
        update: {},
        create: { id, title, artistCredit, coverArt }
      })

      if (action === 'add') {
        await prisma.userFavRelease.create({
          data: { userId, releaseId: id, since }
        })
      } else if (action === 'remove') {
        await prisma.userFavRelease.delete({
          where: {
            userId_releaseId: { userId, releaseId: id }
          }
        })
      }
    } else if (type === 'song') {
      await prisma.song.upsert({
        where: {id},
        update: {},
        create: {id, title, artistCredit, coverArt}
      })

      if (action === 'add') {
        await prisma.userFavSong.create({
          data: { userId, songId: id, since }
        })
      } else if (action === 'remove') {
        await prisma.userFavSong.delete({
          where: {
            userId_songId: { userId, songId: id }
          }
        })
      }
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

  logApiCall(req.method, req.originalUrl)

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

    successApiCall(req.method, req.originalUrl)
    res.json(query)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

// Get profile page details for a user
const profile = async (req, res) => {
  const { id } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!id) {
    errorApiCall(req.method, req.originalUrl, 'Missing User ID.')
    return res.status(400).json({error: 'Missing User ID'})
  }

  try {

    const [userProfile, artistStats, releaseStats, songStats, counts] = await Promise.all([
      await prisma.user.findUnique({
        where: { id },
        include: {
          favArtists: { include: { artist: true } },
          favReleases: { include: { release: true } },
          favSongs: { include: { song: true } },
          artistReviews: { include: { artist: true } },
          releaseReviews: { include: { release: true }},
          songReviews: { include: { song: true }},
        },
        omit: { password: true, email: true, phoneNumber: true }
      }),
      await prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: id }
      }),
      await prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: id }
      }),
      await prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: id }
      }),
    ])

    const starCount = { 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0 }

    for (const group of [...artistStats, ...releaseStats, ...songStats]) {
      starCount[group.rating] += group._count.rating
    }

    const starStats = Object.entries(starCount)
      .map(([rating, count]) => ({ rating: +rating, count }))
      .sort((a, b) => b.rating - a.rating)

    if (!userProfile) {
      errorApiCall(req.method, req.originalUrl, 'User not found')
      return res.status(404).json({ error: 'User not found.' })
    }

    const allReviews = [
      ...userProfile.artistReviews,
      ...userProfile.releaseReviews,
      ...userProfile.songReviews
    ]

    const totalReviewCount = allReviews.length

    console.log(userProfile)
    const profile = {
      ...userProfile,
      totalReviewCount,
      starStats
    }

    successApiCall(req.method, req.originalUrl)
    res.json(profile)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

const isFollowing = async (req, res) => {
  const { userId, profileId } = req.query

  logApiCall(req.method, req.originalUrl)

  try {
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: profileId
        }
      }
    })

    console.log(isFollowing)

    successApiCall(req.method, req.originalUrl)
    res.json(isFollowing) 
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const follow = async (req, res) => {
  const { userId, profileId } = req.body

  logApiCall(req.method, req.originalUrl)
  
  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: profileId
      }
    })

    console.log(follow)
    successApiCall(req.method, req.originalUrl)
    res.json(follow)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

const unfollow = async (req, res) => {
  const { userId, profileId } = req.body

  logApiCall(req.method, req.originalUrl)
  
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: { 
          followerId: userId, 
          followingId: profileId 
        }
      }
    })

    res.json({ success: true })
    successApiCall(req.method, req.originalUrl)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const countFollow = async (req, res) => {
  const { profileId } = req.query

  logApiCall(req.method, req.originalUrl)
  
  try {
    
    const [followers, following] = await Promise.all([
      prisma.follow.count({
        where: {followingId: profileId}
      }),
      prisma.follow.count({
        where: { followerId: profileId }
      })
    ])

    const data = {followers, following}
    console.log(data)
    successApiCall(req.method, req.originalUrl)
    res.json(data)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

module.exports = {
  getUsers,
  findUserById,
  getFavorites,
  favorite,
  query,
  profile,
  isFollowing,
  follow,
  unfollow,
  countFollow
};