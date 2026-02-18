const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')
const { calcStarStats } = require('./hooks/calcStarStats')
const { tagConnectOrCreate } = require('./hooks/tagConnectOrCreate')

const limit = 25

const artistReviews = async (req, res) => {
  const { id } = req.query
  let page = Number(req.query.page) || 1
  let star = Number(req.query.star) || null

  const limit = 10
  logApiCall(req)

  try {
    if (!id) return res.status(400).json({ error: 'Missing artist id' })
    if (!page) return res.status(400).json({ error: 'Missing page number' })

    const reviews = await prisma.userArtistReviews.findMany({
      where: {
        artistId: id,
        status: "PUBLISHED",
        ...(star ? { rating: star } : {})
      },
      include: {
        user: { omit: { password: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const [allStats, filteredStats, artistStats] = await Promise.all([
      prisma.userArtistReviews.aggregate({
        where: { artistId: id, status: 'PUBLISHED' },
        _avg: { rating: true }
      }),
      prisma.userArtistReviews.aggregate({
        where: { artistId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
        _count: true
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { artistId: id, status: 'PUBLISHED' }
      }),
    ])

    const avgRounded = allStats._avg.rating ? +allStats._avg.rating.toFixed(2) : 0
    const starStats = calcStarStats(artistStats)

    const data = { reviews, avgRating: avgRounded, starStats }

    successApiCall(req)
    res.json({
      data,
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit
    })
  } catch (error) {
    errorApiCall(req, error)
  }
}

const releaseReviews = async(req, res) => {
  const { id } = req.query
  let page = Number(req.query.page) || 0
  let star = Number(req.query.star) || null

  logApiCall(req)

  try {
    if (!id) {
      errorApiCall(req, 'Missing parameters')
      res.status(400).json({error : 'Missing parameters'})
    }
    
    if (!page) {
      errorApiCall(req, 'Missing Page Number')
      res.status(400).json({error : 'Missing Page Number'})
    }

    const [reviews, allStats, filteredStats, releaseStats] = await Promise.all([
      prisma.userReleaseReviews.findMany({
        where: { releaseId: id, status: 'PUBLISHED', ...(star ? {rating: star}: {}) },
        include: { user: { omit: { password: true } } },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.userReleaseReviews.aggregate({
        where: { releaseId: id, status: 'PUBLISHED' },
        _avg: { rating: true },
      }),
      prisma.userReleaseReviews.aggregate({
        where: { releaseId: id, status: 'PUBLISHED', ...(star ? {rating: star}: {})},
        _count: true
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: id, status: 'PUBLISHED'}
      })
    ])

    const average = allStats._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0
    const starStats = calcStarStats(releaseStats)

    const data = {reviews, avgRating: avgRounded ?? 0, starStats}

    // console.log(data)
    successApiCall(req)
    res.json({
      data,
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit: limit
    })
  } catch (error) {
    errorApiCall(req, error)
  }
  
}

const songReviews = async(req, res) => {
  const { songId, workId } = req.query
  let page = Number(req.query.page) || 0
  let star = Number(req.query.star) || null

  logApiCall(req)

  try {
    if (!songId) {
      errorApiCall(req, 'Missing parameters')
      return res.status(400).json({error : 'Missing parameters'})
    }

    if (!page) {
      errorApiCall(req, 'Missing Page Number')
      return res.status(400).json({error : 'Missing Page Number'})
    }

    const id = songId === workId ? songId : workId
    const [reviews, allStats, filteredStats, songStats] = await Promise.all([
      prisma.userSongReviews.findMany({
        where: { songId: id, status: 'PUBLISHED', ...(star ? {rating: star}: {})},
        include: { user: { omit: { password: true } } },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.userSongReviews.aggregate({
        where: { songId: id, status: 'PUBLISHED' },
        _avg: { rating: true },
      }),
      prisma.userSongReviews.aggregate({
        where: { songId: id, status: 'PUBLISHED', ...(star ? {rating: star}: {})},
        _count: true
      }),
      prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { songId: id, status: 'PUBLISHED' }
      })
    ])

    const average = allStats._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0
    const starStats = calcStarStats(songStats)

    const data = {reviews, avgRating: avgRounded ?? 0, starStats}

    successApiCall(req)
    res.json({
      data,
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit: limit
    })
  } catch (error) {
    errorApiCall(req, error)
  }

}

const user = async (req, res) => {
  const {userId, itemId, type, workId} = req.query

  logApiCall(req)

  try {
    let review
    if (type === 'artist') {
      review = await prisma.userArtistReviews.findUnique({
        where: { userId_artistId: { userId, artistId: itemId}}
      })
    } else if (type === 'release') {
      review = await prisma.userReleaseReviews.findUnique({
        where: { userId_releaseId: { userId, releaseId: itemId}}
      })
    } else if (type === 'song') {
      const id = itemId === workId ? itemId : workId
      review = await prisma.userSongReviews.findUnique({
        where: { userId_songId: { userId, songId: id}}
      })
    }

    console.log(review)
    successApiCall(req)
    return res.json(review)
  } catch (error) {
    errorApiCall(req, error)
  }
}

const publishOrDraft = async (req, res) => {
  const {
    itemId, title, 
    rating, review, type, 
    status, itemName, itemTitle, 
    artistCredit, coverArt, tags
  } = req.body
  
  logApiCall(req)

  if (!req.user) {
    errorApiCall(req, 'Unauthorized')
    return res.status(401).json({error: 'Unauthorized'})
  }

  if (status !== 'PUBLISHED' && status !== 'DRAFT') {
    errorApiCall(req, 'Invalid Status')
    return res.status(400).json({error: 'Invalid Status'})
  }

  try {

    const updateData = {
      title: title,
      rating: rating,
      review: review,
      status: status,
      updatedAt: new Date()
    }
    const createData = {
      userId: req.user.id,
      title: title,
      rating: rating,
      review: review,
      status: status,
    }

    let published
    let newAvg
    let stats
    if (type === 'artist') {
      await prisma.artist.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, name: itemName}
      });

      published = await prisma.userArtistReviews.upsert({
        where : { userId_artistId: { userId: req.user.id, artistId: itemId } },
        update: {
          ...updateData,
          tags: {
            deleteMany: {},  // remove old tags
            create: tagConnectOrCreate(tags)
          }
        },
        create: {
          ...createData,
          artistId: itemId,
          tags: {
            create: tagConnectOrCreate(tags)
          }
        },
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userArtistReviews.aggregate({
        where: { artistId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true },
        _count: true
      })

      stats = await prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { artistId: itemId, status: 'PUBLISHED' }
      })

    } else if (type === 'release') {
      await prisma.release.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, title: itemTitle, artistCredit, coverArt}
      });

      published = await prisma.userReleaseReviews.upsert({
        where : { userId_releaseId: { userId: req.user.id, releaseId: itemId } },
        update: updateData,
        create: {...createData, releaseId: itemId},
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userReleaseReviews.aggregate({
        where: { releaseId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true },
        _count: true
      })

      stats = await prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: itemId, status: 'PUBLISHED' }
      })

    } else if (type === 'song') {

      await prisma.song.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, title: itemTitle, artistCredit, coverArt}
      })
      
      published = await prisma.userSongReviews.upsert({
        where : { userId_songId: { userId: req.user.id, songId: itemId } },
        update: updateData,
        create: {...createData, songId: itemId},
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userSongReviews.aggregate({
        where: { songId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true },
        _count: true
      })

      stats = await prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { songId: itemId, status: 'PUBLISHED' }
      })

    }
    
    console.log(newAvg)
    const average = newAvg._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0
    const starStats = calcStarStats(stats)

    successApiCall(req)
    const data = {
      review: published, 
      avg: avgRounded ?? 0,
      starStats,
      count: newAvg._count,
      limit: limit
    }
    console.log(data)
    return res.json(data)
  } catch (error) {
    errorApiCall(req, error)
  }
}

const deleteReview = async (req, res) => {
  const { itemId, type } = req.query

  logApiCall(req)

  try {

    let deleted
    let newAvg
    let stats
    if (type === 'artist') {
      deleted = await prisma.userArtistReviews.delete({
        where: { userId_artistId: { userId: req.user.id, artistId: itemId } }
      })
      newAvg = await prisma.userArtistReviews.aggregate({
        where: { artistId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true},
        _count: { rating: true}
      })      
      stats = await prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { artistId: itemId, status: 'PUBLISHED' }
      })
    } else if (type === 'release') {
      deleted = await prisma.userReleaseReviews.delete({
        where: { userId_releaseId: { userId: req.user.id, releaseId: itemId } }
      })
      newAvg = await prisma.userReleaseReviews.aggregate({
        where: { releaseId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true},
        _count: { rating: true}
      })      
      stats = await prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: itemId, status: 'PUBLISHED' }
      })
    } else if (type === 'song') {
      deleted = await prisma.userSongReviews.delete({
        where: { userId_songId: { userId: req.user.id, songId: itemId } }
      })
      newAvg = await prisma.userSongReviews.aggregate({
        where: { songId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true},
        _count: { rating: true}
      })      
      stats = await prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { songId: itemId, status: 'PUBLISHED' }
      })
    }

    const starStats = calcStarStats(stats)

    successApiCall(req)
    return res.json({
      action: 'DELETED', 
      review: deleted, 
      avg: newAvg._avg.rating, 
      starStats,
      count: newAvg._count.rating
    })
  } catch (error) {
    errorApiCall(req, error)
  }
  
}

const userArtists = async (req, res) => {
  const userId = req.query.userId
  const page = Number(req.query.page) || null
  const star = Number(req.query.star) || null

  const limit = 25

  if (!userId || !page) {
    // error handling
  }

  logApiCall(req)

  try {

    const [
      artistReviews,
      stats,
      reviewStats
    ] = await Promise.all([
      prisma.userArtistReviews.findMany({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        include: { artist: true },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userArtistReviews.aggregate({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        _count: true
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: userId, status: 'PUBLISHED' }
      })
    ])

    const starStats = calcStarStats(reviewStats)
    
    const data = {
      data: { 
        reviews: artistReviews,
        starStats: starStats
      },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit: limit
    }

    console.log(data.data.reviews)

    res.json(data)
    successApiCall(req)
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: `Error fetching users artist reviews`})
  }

}

const userReleases = async (req, res) => {
  const userId = req.query.userId
  const page = Number(req.query.page) || null
  const star = Number(req.query.star) || null

  const limit = 25

  if (!userId || !page) {
    // error handling
  }

  logApiCall(req)

  try {

    const [
      releaseReviews,
      stats,
      reviewStats
    ] = await Promise.all([
      prisma.userReleaseReviews.findMany({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        include: { release: true},
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userReleaseReviews.aggregate({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        _count: true
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: userId, status: 'PUBLISHED' }
      })
    ])

    const starStats = calcStarStats(reviewStats)
    
    const data = {
      data: { 
        reviews: releaseReviews,
        starStats: starStats
      },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit: limit
    }

    console.log(data)

    res.json(data)
    successApiCall(req)
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: `Error fetching users artist reviews`})
  }

}

const userSongs = async (req, res) => {
  const userId = req.query.userId
  const page = Number(req.query.page) || null
  const star = Number(req.query.star) || null

  const limit = 25

  if (!userId || !page) {
    // error handling
  }

  logApiCall(req)

  try {

    const [
      songReviews,
      stats,
      reviewStats
    ] = await Promise.all([
      prisma.userSongReviews.findMany({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        include: { song: true },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userSongReviews.aggregate({
        where: { userId: userId, status: 'PUBLISHED', ...(star && {rating: star})},
        _count: true
      }),
      prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { userId: userId, status: 'PUBLISHED' }
      })
    ])

    const starStats = calcStarStats(reviewStats)
    
    const data = {
      data: { 
        reviews: songReviews,
        starStats: starStats
      },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit: limit
    }

    console.log(data.data.reviews)

    res.json(data)
    successApiCall(req)
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: `Error fetching users artist reviews`})
  }

}

module.exports = {
  artistReviews,
  releaseReviews,
  songReviews,
  user,
  userArtists,
  userReleases,
  userSongs,
  publishOrDraft,
  deleteReview
}