import prisma from '../prisma/client'
import { logApiCall, errorApiCall } from '../utils/logging/logging'
import { Request, Response } from 'express'
import { getLandingEntities, getLandingStats } from '../utils/prisma/stats'

const landingStats = async (req: Request, res: Response) => {
  logApiCall(req)
  try {
    const [reviewedGroups, likedArtistGroups, likedReleaseGroups] = await getLandingStats()

    const artistIds = [...new Set([
      ...reviewedGroups.map(g => g.artistId),
      ...likedArtistGroups.map(g => g.artistId)
    ])]
    const releaseIds = likedReleaseGroups.map(g => g.releaseId)

    const [artists, releases] = await getLandingEntities(artistIds, releaseIds)

    const artistMap = Object.fromEntries(artists.map(a => [a.id, a]))
    const releaseMap = Object.fromEntries(releases.map(r => [r.id, r]))

    return res.json({
      topReviewedArtists: reviewedGroups.map(g => ({
        id: g.artistId,
        name: artistMap[g.artistId]?.name ?? 'Unknown',
        count: g._count.artistId
      })),
      topLikedArtists: likedArtistGroups.map(g => ({
        id: g.artistId,
        name: artistMap[g.artistId]?.name ?? 'Unknown',
        count: g._count.artistId
      })),
      topLikedReleases: likedReleaseGroups.map(g => ({
        id: g.releaseId,
        title: releaseMap[g.releaseId]?.title ?? 'Unknown',
        artistCredit: releaseMap[g.releaseId]?.artistCredit ?? [],
        coverArt: releaseMap[g.releaseId]?.coverArt ?? null,
        count: g._count.releaseId
      }))
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch landing stats' })
  }
}

export { landingStats }
