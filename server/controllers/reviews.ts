import z from 'zod'
import prisma from '../prisma/client'
import { logApiCall, errorApiCall, successApiCall } from '../utils/logging/logging'
import { calcStarStats } from './hooks/calcStarStats'
import { tagConnectOrCreate } from './hooks/tagConnectOrCreate'
import { Request, Response } from 'express'
import { 
  artistReviewsSchema, 
  deleteReviewSchema, 
  publishOrDraftSchema, 
  releaseReviewsSchema, 
  songReviewsSchema,
  userArtistsSchema,
  userReleasesSchema,
  userReviewSchema,
  userSongsSchema
} from '../schemas/reviews.schema'
import { deleteReviewByType, getArtistReviews, getArtistReviewStats, getReleaseReviews, getReleaseReviewStats, getReviewStats, getSongReviews, getSongReviewStats, getUserArtistReviews, getUserReleaseReviews, getUserReview, getUserReviewsByType, upsertArtistReview, upsertItemReview } from '../utils/prisma/reviews'
import { calcAvgRating } from '../utils/reviews/format'

const limit = 25

const artistReviews = async (req: Request, res: Response) => {
  logApiCall(req)
  const { id, page, star } = req.validatedQuery as z.infer<typeof artistReviewsSchema>

  try {
    const [reviews, [allStats, filteredStats, artistStats]] = await Promise.all([
      getArtistReviews(id, page, star, limit),
      getArtistReviewStats(id, star)
    ])

    const avgRounded = calcAvgRating(allStats._avg.rating)
    const starStats = calcStarStats(artistStats)

    successApiCall(req)
    return res.json({
      data: { reviews, avgRating: avgRounded, starStats },
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch artist reviews.' })
  }
}

const releaseReviews = async (req: Request, res: Response) => {
  logApiCall(req)
  const { id, page, star } = req.validatedQuery as z.infer<typeof releaseReviewsSchema>

  try {
    const [reviews, [allStats, filteredStats, releaseStats]] = await Promise.all([
      getReleaseReviews(id, page, star, limit),
      getReleaseReviewStats(id, star)
    ])

    const starStats = calcStarStats(releaseStats)

    successApiCall(req)
    return res.json({
      data: { reviews, avgRating: calcAvgRating(allStats._avg.rating), starStats },
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch release reviews.' })
  }
}

const songReviews = async (req: Request, res: Response) => {
  logApiCall(req)
  const { songId, workId, page, star } = req.validatedQuery as z.infer<typeof songReviewsSchema>

  if (!songId) return res.status(400).json({ error: 'Missing parameters' })
  if (!page) return res.status(400).json({ error: 'Missing page number' })

  const id = workId || songId

  try {
    const [reviews, [allStats, filteredStats, songStats]] = await Promise.all([
      getSongReviews(id, page, star, limit),
      getSongReviewStats(id, star)
    ])

    const starStats = calcStarStats(songStats)

    successApiCall(req)
    return res.json({
      data: { reviews, avgRating: calcAvgRating(allStats._avg.rating), starStats },
      count: filteredStats._count,
      pages: Math.ceil(filteredStats._count / limit),
      currentPage: page,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch song reviews.' })
  }
}

const user = async (req: Request, res: Response) => {
  logApiCall(req)
  const { userId, itemId, type, workId } = req.validatedQuery as z.infer<typeof userReviewSchema>

  try {
    const review = await getUserReview(userId, itemId, type, workId)
    successApiCall(req)
    return res.json(review)
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch review.' })
  }
}

const publishOrDraft = async (req: Request, res: Response) => {
  logApiCall(req)
  const {
    itemId, title, rating, review,
    type, status, itemName, itemTitle,
    artistCredit, coverArt, tags
  } = req.validatedBody as z.infer<typeof publishOrDraftSchema>

  const userId = req.user!.id
  const createData = { userId, title, rating, review, status }
  const updateData = { title, rating, review, status, updatedAt: new Date() }

  try {
    let published

    if (type === 'artist') {
      published = await upsertArtistReview(userId, itemId, itemName!, createData, updateData, tags)
    } else if (type === 'release') {
      published = await upsertItemReview('release', userId, itemId, itemTitle!, artistCredit, coverArt ?? '', createData, updateData)
    } else {
      published = await upsertItemReview('song', userId, itemId, itemTitle!, artistCredit, coverArt ?? '', createData, updateData)
    }

    const [newAvg, stats] = await getReviewStats(type, itemId)
    const starStats = calcStarStats(stats)

    successApiCall(req)
    return res.json({
      review: published,
      avg: calcAvgRating(newAvg._avg.rating),
      starStats,
      count: newAvg._count,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to publish review.' })
  }
}

const deleteReview = async (req: Request, res: Response) => {
  logApiCall(req)
  const { itemId, type } = req.validatedBody as z.infer<typeof deleteReviewSchema>

  try {
    const [deleted, [newAvg, stats]] = await Promise.all([
      deleteReviewByType(type, req.user!.id, itemId),
      getReviewStats(type, itemId)
    ])

    const starStats = calcStarStats(stats)

    successApiCall(req)
    return res.json({
      action: 'DELETED',
      review: deleted,
      avg: calcAvgRating(newAvg._avg.rating),
      starStats,
      count: newAvg._count
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to delete review.' })
  }
}

const userArtists = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId, page, star } = req.validatedQuery as z.infer<typeof userArtistsSchema>
  const limit = 25


  try {
    const [reviews, stats, reviewStats] = await getUserReviewsByType('artist', profileId, page, star, limit)
    const starStats = calcStarStats(reviewStats)

    successApiCall(req)
    return res.json({
      data: { reviews, starStats },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch user artist reviews.' })
  }
}

const userReleases = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId, page, star } = req.validatedQuery as z.infer<typeof userReleasesSchema>
  const limit = 25


  try {
    const [reviews, stats, reviewStats] = await getUserReviewsByType('release', profileId, page, star, limit)
    const starStats = calcStarStats(reviewStats)

    successApiCall(req)
    return res.json({
      data: { reviews, starStats },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch user release reviews.' })
  }
}

const userSongs = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId, page, star } = req.validatedQuery as z.infer<typeof userSongsSchema>
  const limit = 25


  try {
    const [reviews, stats, reviewStats] = await getUserReviewsByType('song', profileId, page, star, limit)
    const starStats = calcStarStats(reviewStats)

    successApiCall(req)
    return res.json({
      data: { reviews, starStats },
      currentPage: page,
      pages: Math.ceil(stats._count / limit),
      count: stats._count,
      limit
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch user song reviews.' })
  }
}


export default {
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