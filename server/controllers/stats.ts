import prisma from '../prisma/client'
import { logApiCall, errorApiCall } from '../utils/logging'
import { Request, Response } from 'express'

const landingStats = async (req: Request, res: Response) => {
  logApiCall(req)

  try {
    const [reviewedGroups, likedArtistGroups, likedReleaseGroups] = await Promise.all([
      prisma.userArtistReviews.groupBy({
        by: ['artistId'],
        where: { status: 'PUBLISHED' },
        _count: { artistId: true },
        orderBy: { _count: { artistId: 'desc' } },
        take: 5,
      }),
      prisma.userLikedArtist.groupBy({
        by: ['artistId'],
        _count: { artistId: true },
        orderBy: { _count: { artistId: 'desc' } },
        take: 5,
      }),
      prisma.userLikedRelease.groupBy({
        by: ['releaseId'],
        _count: { releaseId: true },
        orderBy: { _count: { releaseId: 'desc' } },
        take: 5,
      }),
    ])

    const [reviewedArtists, likedArtists, likedReleases] = await Promise.all([
      prisma.artist.findMany({
        where: { id: { in: reviewedGroups.map(g => g.artistId) } },
      }),
      prisma.artist.findMany({
        where: { id: { in: likedArtistGroups.map(g => g.artistId) } },
      }),
      prisma.release.findMany({
        where: { id: { in: likedReleaseGroups.map(g => g.releaseId) } },
      }),
    ])

    const artistReviewMap = Object.fromEntries(reviewedArtists.map(a => [a.id, a]))
    const artistLikeMap = Object.fromEntries(likedArtists.map(a => [a.id, a]))
    const releaseMap = Object.fromEntries(likedReleases.map(r => [r.id, r]))

    return res.json({
      topReviewedArtists: reviewedGroups.map(g => ({
        id: g.artistId,
        name: artistReviewMap[g.artistId]?.name ?? 'Unknown',
        count: g._count.artistId,
      })),
      topLikedArtists: likedArtistGroups.map(g => ({
        id: g.artistId,
        name: artistLikeMap[g.artistId]?.name ?? 'Unknown',
        count: g._count.artistId,
      })),
      topLikedReleases: likedReleaseGroups.map(g => ({
        id: g.releaseId,
        title: releaseMap[g.releaseId]?.title ?? 'Unknown',
        artistCredit: releaseMap[g.releaseId]?.artistCredit ?? [],
        coverArt: releaseMap[g.releaseId]?.coverArt ?? null,
        count: g._count.releaseId,
      })),
    })

  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch landing stats' })
  }
}

export { landingStats }
