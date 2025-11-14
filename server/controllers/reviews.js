const e = require('express')
const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

const artistReviews = async(req, res) => {
  const { id } = req.query
  
  logApiCall(req.method, req.originalUrl)

  try {
    if (!id) {
      errorApiCall(req.method, req.originalUrl, 'Missing parameters')
      res.status(400).json({error : 'Missing parameters'})
    }

    const [reviews, rating, artistStats] = await Promise.all([
      prisma.userArtistReviews.findMany({
        where: { artistId: id, status: 'PUBLISHED' },
        include: { user: { omit: { password: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userArtistReviews.aggregate({
        where: { artistId: id, status: 'PUBLISHED' },
        _avg: { rating: true }
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { artistId: id }
      })
    ])
    const average = rating._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

    const starCount = { 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0 }
    for (const group of [...artistStats]) {
      starCount[group.rating] += group._count.rating
    }
    const starStats = Object.entries(starCount)
      .map(([rating, count]) => ({ rating: +rating, count }))
      .sort((a, b) => b.rating - a.rating)

    successApiCall(req.method, req.originalUrl)
    res.json({reviews, avgRating: avgRounded ?? 0, starStats})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const releaseReviews = async(req, res) => {
  const { id } = req.query
  
  logApiCall(req.method, req.originalUrl)

  try {
    if (!id) {
      errorApiCall(req.method, req.originalUrl, 'Missing parameters')
      res.status(400).json({error : 'Missing parameters'})
    }

    const [reviews, rating, releaseStats] = await Promise.all([
      prisma.userReleaseReviews.findMany({
        where: { releaseId: id, status: 'PUBLISHED' },
        include: { user: { omit: { password: true } } },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.userReleaseReviews.aggregate({
        where: { releaseId: id, status: 'PUBLISHED' },
        _avg: { rating: true }
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: id }
      })
    ])

    const average = rating._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

    const starCount = { 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0 }
    for (const group of [...releaseStats]) {
      starCount[group.rating] += group._count.rating
    }
    const starStats = Object.entries(starCount)
      .map(([rating, count]) => ({ rating: +rating, count }))
      .sort((a, b) => b.rating - a.rating)

    successApiCall(req.method, req.originalUrl)
    res.json({reviews, avgRating: avgRounded ?? 0, starStats})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
  
}

const songReviews = async(req, res) => {
  const { id } = req.query
  
  logApiCall(req.method, req.originalUrl)

  try {
    if (!id) {
      errorApiCall(req.method, req.originalUrl, 'Missing parameters')
      res.status(400).json({error : 'Missing parameters'})
    }

    const [reviews, rating, songStats] = await Promise.all([
      prisma.userSongReviews.findMany({
        where: { songId: id, status: 'PUBLISHED' },
        include: { user: { omit: { password: true } } },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.userSongReviews.aggregate({
        where: { songId: id, status: 'PUBLISHED' },
        _avg: { rating: true }
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: id }
      })
    ])

    const average = rating._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

    const starCount = { 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0 }
    for (const group of [...songStats]) {
      starCount[group.rating] += group._count.rating
    }
    const starStats = Object.entries(starCount)
      .map(([rating, count]) => ({ rating: +rating, count }))
      .sort((a, b) => b.rating - a.rating)

    successApiCall(req.method, req.originalUrl)
    res.json({reviews, avgRating: avgRounded ?? 0, starStats})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }

}

const user = async (req, res) => {
  const {userId, itemId, type} = req.query

  logApiCall(req.method, req.originalUrl)

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
      review = await prisma.userSongReviews.findUnique({
        where: { userId_songId: { userId, songId: itemId}}
      })
    }

    console.log(review)
    successApiCall(req.method, req.originalUrl)
    return res.json(review)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const publishOrDraft = async (req, res) => {
  const {
    userId, itemId, title, 
    rating, review, type, 
    status, itemName, itemTitle, 
    artistCredit, coverArt
  } = req.body
  
  logApiCall(req.method, req.originalUrl)

  if (status !== 'PUBLISHED' && status !== 'DRAFT') {
    errorApiCall(req.method, req.originalUrl, 'Invalid Status')
    return
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
      userId: userId,
      title: title,
      rating: rating,
      review: review,
      status: status,
    }

    let published
    let newAvg
    let stats
    if (type === 'ARTIST') {
      await prisma.artist.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, name: itemName}
      });

      published = await prisma.userArtistReviews.upsert({
        where : { userId_artistId: { userId, artistId: itemId } },
        update: updateData,
        create: {...createData, artistId: itemId},
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userArtistReviews.aggregate({
        where: { artistId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true }
      }) 

      stats = await prisma.userArtistReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { artistId: itemId }
      })

    } else if (type === 'RELEASE') {
      await prisma.release.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, title: itemTitle, artistCredit, coverArt}
      });

      published = await prisma.userReleaseReviews.upsert({
        where : { userId_releaseId: { userId, releaseId: itemId } },
        update: updateData,
        create: {...createData, releaseId: itemId},
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userReleaseReviews.aggregate({
        where: { releaseId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true }
      })

      stats = await prisma.userReleaseReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { releaseId: itemId }
      })

    } else if (type === 'SONG') {
      await prisma.song.upsert({
        where: { id: itemId },
        update: {},
        create: { id: itemId, title: itemTitle, artistCredit, coverArt}
      })
      
      published = await prisma.userSongReviews.upsert({
        where : { userId_songId: { userId, songId: itemId } },
        update: updateData,
        create: {...createData, songId: itemId},
        include: { user: { omit: { password: true } }, },
      })

      newAvg = await prisma.userSongReviews.aggregate({
        where: { songId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true }
      })

      stats = await prisma.userSongReviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
        where: { songId: itemId }
      })

    }

    const action = published.createdAt.getTime() === published.updatedAt.getTime() ? 'CREATED' : 'UPDATED'
    
    const average = newAvg._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

    const starCount = { 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0 }
    for (const group of [...stats]) {
      starCount[group.rating] += group._count.rating
    }
    const starStats = Object.entries(starCount)
      .map(([rating, count]) => ({ rating: +rating, count }))
      .sort((a, b) => b.rating - a.rating)

    successApiCall(req.method, req.originalUrl)
    return res.json({
      action: action, 
      review: published, 
      avg: avgRounded ?? 0,
      starStats 
    })

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const deleteReview = async (req, res) => {
  const { userId, itemId, type } = req.query

  logApiCall(req.method, req.originalUrl)

  try {

    let deleted
    let newAvg
    if (type === 'artist') {
      deleted = await prisma.userArtistReviews.delete({
        where: { userId_artistId: { userId, artistId: itemId } }
      })
      newAvg = await prisma.userArtistReviews.aggregate({
        where: { artistId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true}
      })
    } else if (type === 'release') {
      deleted = await prisma.userReleaseReviews.delete({
        where: { userId_releaseId: { userId, releaseId: itemId } }
      })
      newAvg = await prisma.userReleaseReviews.aggregate({
        where: { releaseId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true}
      })
    } else if (type === 'song') {
      deleted = await prisma.userSongReviews.delete({
        where: { userId_songId: { userId, songId: itemId } }
      })
      newAvg = await prisma.userSongReviews.aggregate({
        where: { songId: itemId, status: 'PUBLISHED'},
        _avg: { rating: true}
      })
    }

    successApiCall(req.method, req.originalUrl)
    return res.json({action: 'DELETED', review: deleted, avg: newAvg._avg.rating})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
  
}

module.exports = {
  user,
  publishOrDraft,
  deleteReview,
  artistReviews,
  releaseReviews,
  songReviews
}