const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging');
const { getSignedURL, deleteObject } = require('./AWS/actions');
const { calcStarStats } = require('./hooks/calcStarStats')

// Gets all users
const getUsers = async (req, res) => {

  logApiCall(req)

  try {
    const users = await prisma.user.count()

    successApiCall(req)
    return res.json(users)
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: 'Counting users failed.'})
  }
}

// Find a user
const findUserById = async (req, res) => {

  try {
    
    logApiCall(req)

    const user = await prisma.user.findUnique({
      where: { 
        id: req.user.id
      }
    })

    if (!user) {
      errorApiCall(req, 'User does not exist')
      return res.status(400).json({error: 'User does not exist.'})
    }

    successApiCall(req)
    return res.json({
      username: user.username,
      email: user.email,
      id: user.id,
      avatar: user.avatar,
      createdAt: user.createdAt,
      phoneNumber: user.phoneNumber,
      favArtists: user.favArtists,
      favSongs: user.favSongs,
      favReleases: user.favReleases
    })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

// Get all favorites by user
const getLikes = async (req, res) => {
  try {
    logApiCall(req)
    const { id, active } = req.query

    if (!id) {
      errorApiCall(req, 'Missing Id')
      return
    }

    const [countArtists, countReleases, countSongs] = await Promise.all([
      prisma.userLikedArtist.count({ where: { userId: id } }),
      prisma.userLikedRelease.count({ where: { userId: id } }),
      prisma.userLikedSong.count({ where: { userId: id } }),
    ])

    const liked = {
      _count: {
        userLikedArtist: countArtists,
        userLikedRelease: countReleases,
        userLikedSong: countSongs,
      },
    }

    if (active === 'artists') {
      liked.userLikedArtist = await prisma.userLikedArtist.findMany({
        where: { userId: id },
        include: { artist: true },
      })
    }

    if (active === 'releases') {
      liked.userLikedRelease = await prisma.userLikedRelease.findMany({
        where: { userId: id },
        include: { release: true },
      })
    }

    if (active === 'songs') {
      liked.userLikedSong = await prisma.userLikedSong.findMany({
        where: { userId: id },
        include: { song: true },
      })
    }

    console.log(liked)

    successApiCall(req)
    res.json(liked)
  } catch (error) {
    errorApiCall(req, error)
  }
}

// Get a batch of users
const query = async (req, res) => {
  const { q } = req.query
  const page = Number(req.query.page) ?? 1

  limit = 50

  logApiCall(req)

  if (q.length === 0) {
    errorApiCall(req, 'Query term length 0')
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

    successApiCall(req)
    res.json({
      data: data,
      count: count._count,
      limit: limit,
      pages: Math.ceil(count._count / limit),
      currentPage: page
    })

  } catch (error) {
    errorApiCall(req, error)
  }
}

// Get profile page details for a user
const profile = async (req, res) => {
  const { profileId, userId } = req.query

  logApiCall(req)
  try {

  
    const promises = [
      prisma.user.findUnique({
        where: { id: profileId },
        include: {
          likedArtists: { include: { artist: true } },
          likedReleases: { include: { release: true } },
          likedSongs: { include: { song: true } },
          _count: {
            select: {
              artistReviews: {
                where: { status: 'PUBLISHED' }
              },
              releaseReviews:  {
                where: { status: 'PUBLISHED' }
              },
              songReviews:  {
                where: { status: 'PUBLISHED' }
              },
              followers: true,
              following: true
            }
          }
        },
        omit: { password: true, email: true }
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId, status: 'PUBLISHED' }
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId, status: 'PUBLISHED' }
      }),
      prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: profileId, status: 'PUBLISHED' }
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
      errorApiCall(req, 'User not found')
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

    successApiCall(req)
    res.json(profile)
  } catch (error) {
    errorApiCall(req, error)
  }
}

const isFollowing = async (req, res) => {
  const { userId, profileId } = req.query

  logApiCall(req)

  try {
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: profileId
        }
      }
    })

    successApiCall(req)
    res.json(isFollowing) 
  } catch (error) {
    errorApiCall(req, error)
  }
}

// Follow a user
const follow = async (req, res) => {
  const { profileId } = req.body

  logApiCall(req)

  if (!req.user) {
    errorApiCall(req, 'Unauthorized')
    return res.status(403).json({error: 'Unauthorized'})
  }
  
  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId: profileId
      }
    })

    successApiCall(req)
    res.json(follow)
  } catch (error) {
    errorApiCall(req, error)
  }

}

// Unfollow a user
const unfollow = async (req, res) => {
  const { profileId } = req.body

  logApiCall(req)
  
  if (!req.user) {
    return res.status(403).json({error: 'Unauthorized'})
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: { 
          followerId: req.user.id, 
          followingId: profileId 
        }
      }
    })

    res.json({ success: true })
    successApiCall(req)
  } catch (error) {
    errorApiCall(req, error)
  }
}

const allFollowers = async (req, res) => {
  const { profileId, page = '1', userId, following } = req.query

  const limit = 25
  const pageNumber = parseInt(page, 10) || 1
  const isFollowingMode = following === 'true'

  logApiCall(req)

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
              omit: { password: true, email: true, aboutMe: true },
            },
          }
        : {
            follower: {
              omit: { password: true, email: true, aboutMe: true },
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

    successApiCall(req);
    res.json(data);
  } catch (error) {
    errorApiCall(req, error);
  }
}

const editInfo = async (req, res) => {
  const profileId = req.query.profileId ?? null
  logApiCall(req)

  if (!profileId) {
    errorApiCall(req, 'Missing Profile ID')
    return res.status(400).json({ error: "Missing Profile ID" })
  }

  if (req.user.id !== profileId) {
    errorApiCall(req, "Forbidden: cannot access another user's data")
    return res.status(403).json({ error: "Forbidden: cannot access another user's data" })
  }

  const userId = req.user
  console.log('user:', userId)

  try {

    const user = await prisma.user.findUnique({
      where: {id: profileId}
    })

    console.log(user)
    successApiCall(req)
    return res.json({
      avatar: '',
      id: user.id,
      username: user.username,
      aboutMe: user.aboutMe ?? '',
      createdAt: user.createdAt,
      email: user.email,
      age: user.age ?? '',
    })

  } catch (error) {
    errorApiCall(req, error)
  }
}

const edit = async (req, res) => {
  logApiCall(req)

  const id = req.user.id
  const avatar = req.file
  const {
    username,
    aboutMe,
    updatedAt
  } = req.body
  const age = req.body.age !== undefined && req.body.age !== '' 
    ? Number(req.body.age) : null
  const resetAvatar = req.body.resetAvatar === 'true'

  // Validation
  let hasError = false
  let errors = {}
  
  try {


    const usernameDuplicate = await prisma.user.findFirst({
      where: { username: username, NOT: { id } }
    })

    if (usernameDuplicate) {
      errors.username = 'Username is already taken'
      hasError = true
    }
  
    // Create Avatar URL
    let url = null
    console.log(resetAvatar)
    if (avatar) {
      const signedUrlRes = await getSignedURL(`avatars/${id}`, avatar.mimetype, avatar.size)
      if (signedUrlRes.success) {
        url = signedUrlRes.success.url
      } else {
        errors.avatar = signedUrlRes.error
        hasError = true
      }
    } else if (resetAvatar) {
      const deleteObjectRes = await deleteObject(`avatars/${id}`)
      if (deleteObjectRes.error) {
        errors.avatar = deleteObjectRes.error
        hasError = true
      }
    }

    if (hasError) {
      return res.status(409).json({errors})
    }

    // Update information
    const data = await prisma.user.update({
      where: { id: id },
      data: {
        username, 
        aboutMe,
        age,
        updatedAt
      },
      select: {
        id: true,
        username: true, 
        aboutMe: true, 
        createdAt: true,
        email: true, 
        age: true,
      }
    })

    successApiCall(req)
    res.status(200).json({
      message: "Profile Updated Successfully",
      data: {...data, age: String(data.age), avatar: ''},
      url: url
    })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(409).json({errors})
  }

}

const reviewPanel = async (req, res) => {
  try {
    const {itemId, type} = req.query

    if (!itemId || !type) {
      errorApiCall(req, 'Missing parameters')
      return res.status(500).json({error: 'Missing parameters'})
    }

    let review
    let like
    if (type === 'artist') {
      review = await prisma.userArtistReviews.findUnique({
        where: { userId_artistId: { userId: req.user.id, artistId: itemId }},
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      })
      like = await prisma.userLikedArtist.findUnique({
        where: { 
          userId_artistId: { userId: req.user.id, artistId: itemId } 
        }
      })
    } else if (type === 'release') {
      review = await prisma.userReleaseReviews.findUnique({
        where: { userId_releaseId: { userId: req.user.id, releaseId: itemId }},
      })
      like = await prisma.userLikedRelease.findUnique({
        where: { userId_releaseId: { userId: req.user.id, releaseId: itemId}}
      })

    } else if (type === 'song') {
      review = await prisma.userSongReviews.findUnique({
        where: { userId_songId: { userId: req.user.id, songId: itemId }},
      })
      like = await prisma.userLikedSong.findUnique({
        where: { userId_songId: { userId: req.user.id, songId: itemId }}
      })
    }
    
    let formattedReview = null;

    if (review) {
      const tags = review.tags?.map(t => t.tag.name) || [];
      formattedReview = { ...review, tags };
    }

    successApiCall(req)
    res.json({review: formattedReview, like})
  } catch (error) {
    errorApiCall(req, error)
  }
}

const like = async (req, res) => {
  try {
    logApiCall(req);

    const { 
      itemId, type, name, 
      title, artistCredit, coverArt 
    } = req.body
    const userId = req.user.id

    if (!itemId || !type) {
      errorApiCall(req, 'Missing itemId or type')
      return res.status(400).json({ error: 'Missing itemId or type' })
    }

    let newLike

    if (type === 'artist') {

      await prisma.artist.upsert({
        where: { id: itemId },
        update: {},
        create: {
          id: itemId,
          name: name,
        }
      })

      newLike = await prisma.userLikedArtist.create({
        data: {
          userId,
          artistId: itemId
        }
      })
    } else if (type === 'release') {

      await prisma.release.upsert({
        where: { id: itemId },
        update: {},
        create: {
          id: itemId,
          title: title,
          artistCredit: artistCredit,
          coverArt: coverArt
        }
      })

      newLike = await prisma.userLikedRelease.create({
        data: {
          userId,
          releaseId: itemId
        }
      })
    } else if (type === 'song') {

      await prisma.song.upsert({
        where: { id: itemId },
        update: {},
        create: {
          id: itemId,
          title: title,
          artistCredit: artistCredit,
          coverArt: coverArt
        }
      })

      newLike = await prisma.userLikedSong.create({
        data: {
          userId,
          songId: itemId
        }
      })
    } else {
      errorApiCall(req, 'Invalid type');
      return res.status(400).json({ error: 'Invalid type' });
    }

    successApiCall(req);
    res.json({ success: true, like: newLike });
  } catch (error) {
    errorApiCall(req, error)
  }
}

const deleteLike = async (req, res) => {
  try {
    logApiCall(req)
    const { itemId, type } = req.body   

    if (type === 'artist') {
      await prisma.userLikedArtist.deleteMany({
        where: { userId: req.user.id, artistId: itemId}
      })
    } else if (type === 'release') {
      await prisma.userLikedRelease.deleteMany({
        where: { userId: req.user.id, releaseId: itemId}
      })
    } else if (type === 'song') {
      await prisma.userLikedSong.deleteMany({
        where: { userId: req.user.id, songId: itemId}
      })
    } else {
      errorApiCall(req, 'Invalid type')
      return res.status()
    }

    successApiCall(req)
    res.json({success: true})
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getUsers,
  query,
  getLikes,
  profile,
  allFollowers,
  isFollowing,
  findUserById,
  editInfo,
  reviewPanel,
  follow,
  like,
  unfollow,
  deleteLike,
  edit
};