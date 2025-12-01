const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')
const { calcStarStats } = require('./functions/calcStarStats')

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
  const page = Number(req.query.page) ?? 1

  limit = 50

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
        avatar: true,
        username: true,
        id: true,
        createdAt: true
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    const count = await prisma.user.aggregate({
      where: {
        username: {
          contains: q,
          mode: 'insensitive'
        }
      },
      _count: true
    })

    const data = {
      suggestions: query
    }

    successApiCall(req.method, req.originalUrl)
    res.json({
      data: data,
      count: count._count,
      limit: limit,
      pages: Math.ceil(count._count / limit),
      currentPage: page
    })

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

// Get profile page details for a user
const profile = async (req, res) => {
  const { profileId, userId } = req.query

  logApiCall(req.method, req.originalUrl)
  try {

  
    const promises = [
      prisma.user.findUnique({
        where: { id: profileId },
        include: {
          favArtists: { include: { artist: true } },
          favReleases: { include: { release: true } },
          favSongs: { include: { song: true } },
          _count: {
            select: {
              artistReviews: true,
              releaseReviews: true,
              songReviews: true,
              followers: true,
              following: true
            }
          }
        },
        omit: { password: true, email: true, phoneNumber: true }
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId }
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId }
      }),
      prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId }
      })
    ]

    // Only add follow check if userId exists
    if (userId) {
      promises.push(
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: userId,
              followingId: profileId
            }
          }
        })
      )
    }

    const results = await Promise.all(promises)

    const [
      userProfile,
      artistStats,
      releaseStats,
      songStats,
      isFollowingRes
    ] = results

    if (!userProfile) {
      errorApiCall(req.method, req.originalUrl, 'User not found')
      return res.status(404).json({ error: 'User not found.' })
    }

    const isFollowing = userId ? Boolean(isFollowingRes) : null;

    const starStats = calcStarStats(
      [...artistStats, ...releaseStats, ...songStats]
    )

    const totalReviewCount =
      userProfile._count.artistReviews +
      userProfile._count.releaseReviews +
      userProfile._count.songReviews 

    const { _count, ...rest } = userProfile
    const counts = userProfile._count

    const profile = {
      ...rest,
      totalReviewCount: totalReviewCount,
      starStats,
      ...counts,
      isFollowing: isFollowing,
      followingSince: userId && isFollowing ? isFollowingRes.createdAt : null
    }

    console.log(profile)

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


    successApiCall(req.method, req.originalUrl)
    res.json(isFollowing) 
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

// Follow a user
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

    successApiCall(req.method, req.originalUrl)
    res.json(follow)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

// Unfollow a user
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

// Return the amount of followers and followers a user has
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

    successApiCall(req.method, req.originalUrl)
    res.json(data)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

const allFollowers = async (req, res) => {
  const { profileId, page = '1', userId, following } = req.query

  const limit = 25
  const pageNumber = parseInt(page, 10) || 1
  const isFollowingMode = following === 'true'

  logApiCall(req.method, req.originalUrl)

  try {

    const profile = await prisma.user.findUnique({
      where: { id: profileId },
      select: { username: true },
    })

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const total = await prisma.follow.count({
      where: isFollowingMode
        ? { followerId: profileId }
        : { followingId: profileId },
    })

    const follows = await prisma.follow.findMany({
      where: isFollowingMode
        ? { followerId: profileId }
        : { followingId: profileId },
      include: isFollowingMode
        ? {
            following: {
              omit: { password: true, email: true, phoneNumber: true, aboutMe: true },
            },
          }
        : {
            follower: {
              omit: { password: true, email: true, phoneNumber: true, aboutMe: true },
            },
          },
      skip: (pageNumber - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const targetIds = follows
      .map(f => (isFollowingMode ? f.followingId : f.followerId))
      .filter(id => id !== userId)

    let isFollowingMap = {}
    if (userId && targetIds.length > 0) {
      const usersFollows = await prisma.follow.findMany({
        where: { followerId: userId, followingId: { in: targetIds } },
        select: { followingId: true },
      })

      const followSet = new Set(usersFollows.map(f => f.followingId))
      isFollowingMap = Object.fromEntries(
        targetIds.map(id => [id, followSet.has(id)])
      )
    }

    const data = {
      data: {
        isFollowingMap,
        follows,
        username: profile.username
      },
      pages: Math.ceil(total / limit),
      limit: limit,
      currentPage: pageNumber,
      count: total
    }

    // const data = {
    //   total,
    //   pages: Math.ceil(total / limit),
    //   page: pageNumber,
    //   count: follows.length,
    //   follows,
    //   isFollowing: isFollowingMap,
    //   username: profile.username
    // }

    successApiCall(req.method, req.originalUrl);
    res.json(data);
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error);
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
  countFollow,
  allFollowers,
};