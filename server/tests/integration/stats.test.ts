jest.mock('../../prisma/client', () => ({
  userArtistReviews: { groupBy: jest.fn() },
  userLikedArtist: { groupBy: jest.fn() },
  userLikedRelease: { groupBy: jest.fn() },
  artist: { findMany: jest.fn() },
  release: { findMany: jest.fn() },
}))

jest.mock('../../utils/logging/logging', () => ({
  logApiCall: jest.fn(),
  errorApiCall: jest.fn(),
}))

import prisma from '../../prisma/client'
import { landingStats } from '../../controllers/stats'
import { Request, Response } from 'express'

const prismaMock = prisma as unknown as {
  userArtistReviews: { groupBy: jest.Mock }
  userLikedArtist: { groupBy: jest.Mock }
  userLikedRelease: { groupBy: jest.Mock }
  artist: { findMany: jest.Mock }
  release: { findMany: jest.Mock }
}

const mockReq = { method: 'GET', originalUrl: '/api/stats/landing' } as unknown as Request

const mockRes = () => {
  const res = {} as unknown as Response
  res.json = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  return res
}

const reviewedGroups = [
  { artistId: 'a1', _count: { artistId: 10 } },
  { artistId: 'a2', _count: { artistId: 7 } },
]
const likedArtistGroups = [
  { artistId: 'a3', _count: { artistId: 5 } },
]
const likedReleaseGroups = [
  { releaseId: 'r1', _count: { releaseId: 3 } },
]

const reviewedArtists = [
  { id: 'a1', name: 'Radiohead' },
  { id: 'a2', name: 'Portishead' },
]
const likedArtists = [
  { id: 'a3', name: 'Massive Attack' },
]
const likedReleases = [
  { id: 'r1', title: 'OK Computer', artistCredit: [{ name: 'Radiohead' }], coverArt: 'cover.jpg' },
]

beforeEach(() => {
  jest.clearAllMocks()
  prismaMock.userArtistReviews.groupBy.mockResolvedValue(reviewedGroups)
  prismaMock.userLikedArtist.groupBy.mockResolvedValue(likedArtistGroups)
  prismaMock.userLikedRelease.groupBy.mockResolvedValue(likedReleaseGroups)
  prismaMock.artist.findMany
    .mockResolvedValueOnce(reviewedArtists)
    .mockResolvedValueOnce(likedArtists)
  prismaMock.release.findMany.mockResolvedValue(likedReleases)
})

describe('landingStats', () => {
  it('returns topReviewedArtists with name and count', async () => {
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        topReviewedArtists: [
          { id: 'a1', name: 'Radiohead', count: 10 },
          { id: 'a2', name: 'Portishead', count: 7 },
        ],
      })
    )
  })

  it('returns topLikedArtists with name and count', async () => {
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        topLikedArtists: [{ id: 'a3', name: 'Massive Attack', count: 5 }],
      })
    )
  })

  it('returns topLikedReleases with title, artistCredit, coverArt and count', async () => {
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        topLikedReleases: [
          {
            id: 'r1',
            title: 'OK Computer',
            artistCredit: [{ name: 'Radiohead' }],
            coverArt: 'cover.jpg',
            count: 3,
          },
        ],
      })
    )
  })

  it('falls back to "Unknown" name when artist is not in lookup', async () => {
    prismaMock.artist.findMany
      .mockReset()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(likedArtists)
    const res = mockRes()
    await landingStats(mockReq, res)
    const { topReviewedArtists } = (res.json as jest.Mock).mock.calls[0][0]
    expect(topReviewedArtists[0].name).toBe('Unknown')
  })

  it('falls back to "Unknown" title, empty artistCredit and null coverArt when release is not in lookup', async () => {
    prismaMock.release.findMany.mockResolvedValue([])
    const res = mockRes()
    await landingStats(mockReq, res)
    const { topLikedReleases } = (res.json as jest.Mock).mock.calls[0][0]
    expect(topLikedReleases[0]).toEqual({
      id: 'r1',
      title: 'Unknown',
      artistCredit: [],
      coverArt: null,
      count: 3,
    })
  })

  it('queries reviewed artists with PUBLISHED status', async () => {
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(prismaMock.userArtistReviews.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PUBLISHED' } })
    )
  })

  it('limits each group query to 5 results', async () => {
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(prismaMock.userArtistReviews.groupBy).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }))
    expect(prismaMock.userLikedArtist.groupBy).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }))
    expect(prismaMock.userLikedRelease.groupBy).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }))
  })

  it('returns 500 and error message when prisma throws', async () => {
    prismaMock.userArtistReviews.groupBy.mockRejectedValue(new Error('DB down'))
    const res = mockRes()
    await landingStats(mockReq, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch landing stats' })
  })
})