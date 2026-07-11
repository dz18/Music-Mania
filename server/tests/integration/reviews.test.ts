import request from 'supertest'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

process.env.NEXTAUTH_SECRET = 'test-secret'

jest.mock('../../prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

jest.mock('../../utils/logging/logging', () => ({
  logApiCall: jest.fn(),
  errorApiCall: jest.fn(),
  successApiCall: jest.fn(),
}))

import prisma from '../../prisma/client'
import app from './app'

const prismaMock = prisma as DeepMockProxy<PrismaClient>

const validToken = jwt.sign({ id: 'user-1', email: 'test@example.com' }, 'test-secret')
const authHeader = `Bearer ${validToken}`

const defaultAggregate = { _avg: { rating: 4.0 }, _count: { rating: 5 } }
const defaultGroupBy = [{ rating: 4, _count: { rating: 5 } }]
const defaultReview = {
  id: 'rev-1',
  userId: 'user-1',
  rating: 4,
  review: 'Great',
  title: 'Nice',
  status: 'PUBLISHED' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  artistId: 'a1',
  user: { id: 'user-1', username: 'john' },
}


beforeEach(() => {
  jest.clearAllMocks()
  prismaMock.userArtistReviews.aggregate.mockResolvedValue(defaultAggregate)
  prismaMock.userArtistReviews.groupBy.mockResolvedValue(defaultGroupBy)
  prismaMock.userReleaseReviews.aggregate.mockResolvedValue(defaultAggregate)
  prismaMock.userReleaseReviews.groupBy.mockResolvedValue(defaultGroupBy)
  prismaMock.userSongReviews.aggregate.mockResolvedValue(defaultAggregate)
  prismaMock.userSongReviews.groupBy.mockResolvedValue(defaultGroupBy)
})

// ─── GET /reviews/artist ──────────────────────────────────────────────────────

describe('GET /api/reviews/artist', () => {
  it('returns 400 when id is missing', async () => {
    const res = await request(app).get('/api/reviews/artist?page=1')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing artist id/i)
  })

  it('returns 200 with reviews on success', async () => {
    prismaMock.userArtistReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/artist?id=a1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
    expect(res.body.data.avgRating).toBeDefined()
  })

  it('filters by star rating when provided', async () => {
    prismaMock.userArtistReviews.findMany.mockResolvedValue([])

    const res = await request(app).get('/api/reviews/artist?id=a1&page=1&star=5')
    expect(res.status).toBe(200)
    const call = prismaMock.userArtistReviews.findMany.mock.calls[0][0]
    expect(call.where.rating).toBe(5)
  })
})

// ─── GET /reviews/release ─────────────────────────────────────────────────────

describe('GET /api/reviews/release', () => {
  it('returns 200 with release reviews', async () => {
    prismaMock.userReleaseReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/release?id=rg1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
  })
})

// ─── GET /reviews/song ────────────────────────────────────────────────────────

describe('GET /api/reviews/song', () => {
  it('returns 400 when songId is missing', async () => {
    const res = await request(app).get('/api/reviews/song?page=1')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing parameters/i)
  })

  it('returns 200 with song reviews', async () => {
    prismaMock.userSongReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/song?songId=s1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
  })
})

// ─── GET /reviews/user ────────────────────────────────────────────────────────

describe('GET /api/reviews/user', () => {
  it('returns the artist review for type=artist', async () => {
    prismaMock.userArtistReviews.findUnique.mockResolvedValue(defaultReview)

    const res = await request(app).get('/api/reviews/user?userId=user-1&itemId=a1&type=artist')
    expect(res.status).toBe(200)
    expect(prismaMock.userArtistReviews.findUnique).toHaveBeenCalledTimes(1)
  })

  it('returns the release review for type=release', async () => {
    prismaMock.userReleaseReviews.findUnique.mockResolvedValue(defaultReview)

    const res = await request(app).get('/api/reviews/user?userId=user-1&itemId=rg1&type=release')
    expect(res.status).toBe(200)
    expect(prismaMock.userReleaseReviews.findUnique).toHaveBeenCalledTimes(1)
  })
})

// ─── GET /reviews/user/artists ────────────────────────────────────────────────

describe('GET /api/reviews/user/artists', () => {
  it('returns 200 with user artist reviews', async () => {
    prismaMock.userArtistReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/user/artists?profileId=user-1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
  })
})

// ─── GET /reviews/user/releases ──────────────────────────────────────────────

describe('GET /api/reviews/user/releases', () => {
  it('returns 200 with user release reviews', async () => {
    prismaMock.userReleaseReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/user/releases?profileId=user-1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
  })
})

// ─── GET /reviews/user/songs ──────────────────────────────────────────────────

describe('GET /api/reviews/user/songs', () => {
  it('returns 200 with user song reviews', async () => {
    prismaMock.userSongReviews.findMany.mockResolvedValue([defaultReview])

    const res = await request(app).get('/api/reviews/user/songs?profileId=user-1&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.reviews).toHaveLength(1)
  })
})

// ─── PUT /reviews (publishOrDraft) ───────────────────────────────────────────

describe('PUT /api/reviews', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).put('/api/reviews').send({})
    expect(res.status).toBe(401)
  })

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .put('/api/reviews')
      .set('Authorization', 'Bearer bad-token')
      .send({})
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid status with valid token', async () => {
    const res = await request(app)
      .put('/api/reviews')
      .set('Authorization', authHeader)
      .send({ itemId: 'a1', type: 'artist', status: 'UNKNOWN', title: 'Title', rating: '5', review: 'Great' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/invalid status/i)
  })

  it('publishes an artist review with valid token', async () => {
    prismaMock.artist.upsert.mockResolvedValue({})
    prismaMock.userArtistReviews.upsert.mockResolvedValue({ ...defaultReview, user: { username: 'john' } })

    const res = await request(app)
      .put('/api/reviews')
      .set('Authorization', authHeader)
      .send({
        itemId: 'a1', type: 'artist', status: 'PUBLISHED',
        title: 'Great band', rating: '5', review: 'Amazing', itemName: 'Radiohead',
        tags: []
      })
    expect(res.status).toBe(200)
    expect(res.body.review).toBeDefined()
  })
})

// ─── DELETE /reviews ──────────────────────────────────────────────────────────

describe('DELETE /api/reviews', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).delete('/api/reviews').query({ itemId: 'a1', type: 'artist' })
    expect(res.status).toBe(401)
  })

  it('deletes an artist review with valid token', async () => {
    prismaMock.userArtistReviews.delete.mockResolvedValue(defaultReview)
    prismaMock.userArtistReviews.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { rating: 0 } })
    prismaMock.userArtistReviews.groupBy.mockResolvedValue([])

    const res = await request(app)
      .delete('/api/reviews')
      .set('Authorization', authHeader)
      .send({ itemId: 'a1', type: 'artist' })
    expect(res.status).toBe(200)
    expect(res.body.action).toBe('DELETED')
  })
})
