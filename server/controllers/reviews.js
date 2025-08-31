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

module.exports = {
  reviews
}