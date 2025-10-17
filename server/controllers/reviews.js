const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

const reviews = async (req, res) => {
  const {type, id} = req.query

  logApiCall(req.method, req.originalUrl)

  if (!type || !id) {
    errorApiCall(req.method, req.originalUrl, 'Missing parameters')
    res.status(400).json({error : 'Missing parameters'})
  }

  try {
    const [reviews, rating] = await Promise.all([
      prisma.review.findMany({
        where: {
          itemId: id,
          status: 'PUBLISHED',
          type: type
        },
        include: {
          user: {
            omit: {
              password: true
            },
          },
        },
        orderBy: {
          rating: 'desc'
        }
      }),
      prisma.review.aggregate({
        where: {
          itemId: id,
          status: 'PUBLISHED',
          type: type
        },
        _avg: {
          rating: true
        }
      })
    ])

    const average = rating._avg.rating
    const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

    successApiCall(req.method, req.originalUrl)
    res.json({reviews, avgRating: avgRounded ?? 0})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    res.status(400).json({error: 'Error fetching reviews'})
  }
}

const user = async (req, res) => {
  const {userId, itemId} = req.query

  logApiCall(req.method, req.originalUrl)

  try {
    const review = await prisma.review.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId
        }
      }
    })

    successApiCall(req.method, req.originalUrl)
    return res.json(review)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const publishOrDraft = async (req, res) => {
  const {userId, itemId, title, rating, review, type, status} = req.body
  
  logApiCall(req.method, req.originalUrl)

  if (status !== 'PUBLISHED' && status !== 'DRAFT') {
    errorApiCall(req.method, req.originalUrl, 'Invalid Status')
    return
  }

  try {

    const published = await prisma.review.upsert({
      where : {     
        userId_itemId: {
          userId,
          itemId
        }
      },
      update: {
        title: title,
        rating: rating,
        review: review,
        status: status,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        itemId: itemId,
        title: title,
        rating: rating,
        review: review,
        type: type,
        status: status,
      },
      include: {
        user: {
          omit: {
            password: true
          }
        },
      },
    })

    const action = published.createAt.getTime() === published.updatedAt.getTime() ? 'CREATED' : 'UPDATED'

    const newAvg = await prisma.review.aggregate({
      where: { itemId, status: 'PUBLISHED' },
      _avg: { rating: true }
    })

    successApiCall(req.method, req.originalUrl)
    return res.json({action: action, review: published, avg: newAvg._avg.rating.toFixed(2)})

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const deleteReview = async (req, res) => {
  const { userId, itemId, id } = req.query

  logApiCall(req.method, req.originalUrl)

  try {

    const deleted = await prisma.review.delete({
      where: {userId, id, itemId},
    })

    const newAvg = await prisma.review.aggregate({
      where: {itemId, status: 'PUBLISHED'},
      _avg: {rating: true}
    })

    successApiCall(req.method, req.originalUrl)
    return res.json({action: 'DELETED', review: deleted, avg: newAvg._avg.rating})
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
  
}

module.exports = {
  reviews,
  user,
  publishOrDraft,
  deleteReview
}