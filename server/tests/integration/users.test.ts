import request from 'supertest'
import jwt from 'jsonwebtoken'
process.env.NEXTAUTH_SECRET = 'test-secret'

jest.mock('../../prisma/client', () => ({
  user: {
    count: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
  userLikedArtist: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  userLikedRelease: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  userLikedSong: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  follow: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  userArtistReviews: {
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  userReleaseReviews: {
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  userSongReviews: {
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}))

jest.mock('../../utils/logging/logging', () => ({
  logApiCall: jest.fn(),
  errorApiCall: jest.fn(),
  successApiCall: jest.fn(),
}))

jest.mock('../../controllers/AWS/actions', () => ({
  getSignedURL: jest.fn(),
  deleteObject: jest.fn(),
}))

jest.mock('../../controllers/hooks/getDominateColor', () => ({
  getGradientColors: jest.fn().mockResolvedValue(['#000000', '#111111']),
}))

import prisma from '../../prisma/client'
import app from './app'
const prismaMock = prisma as unknown as {
  user: { count: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock; aggregate: jest.Mock }
  userLikedArtist: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock }
  userLikedRelease: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock }
  userLikedSong: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock }
  follow: { findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock; findMany: jest.Mock; count: jest.Mock }
  userArtistReviews: { aggregate: jest.Mock; groupBy: jest.Mock; findMany: jest.Mock; count: jest.Mock }
  userReleaseReviews: { aggregate: jest.Mock; groupBy: jest.Mock; findMany: jest.Mock; count: jest.Mock }
  userSongReviews: { aggregate: jest.Mock; groupBy: jest.Mock; findMany: jest.Mock; count: jest.Mock }
}


const validToken = jwt.sign({ id: 'user-1', email: 'test@example.com' }, 'test-secret')
const authHeader = `Bearer ${validToken}`

beforeEach(() => jest.clearAllMocks())

// ─── GET /users/total ─────────────────────────────────────────────────────────

describe('GET /api/users/total', () => {
  it('returns the total user count', async () => {
    prismaMock.user.count.mockResolvedValue(42)

    const res = await request(app).get('/api/users/total')
    expect(res.status).toBe(200)
    expect(res.body).toBe(42)
  })
})

// ─── GET /users/query ─────────────────────────────────────────────────────────

describe('GET /api/users/query', () => {
  it('returns 400 when q is empty', async () => {
    const res = await request(app).get('/api/users/query?q=')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing query term/i)
  })

  it('returns user search results', async () => {
    prismaMock.user.findMany.mockResolvedValue(
      [{ id: 'user-1', username: 'john', createdAt: new Date() }]
    )
    prismaMock.user.aggregate.mockResolvedValue({ _count: 1 })

    const res = await request(app).get('/api/users/query?q=john&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.suggestions).toHaveLength(1)
  })
})

// ─── GET /users/likes ─────────────────────────────────────────────────────────

describe('GET /api/users/likes', () => {
  it('returns like counts for a user', async () => {
    prismaMock.userLikedArtist.count.mockResolvedValue(3)
    prismaMock.userLikedRelease.count.mockResolvedValue(5)
    prismaMock.userLikedSong.count.mockResolvedValue(10)

    const res = await request(app).get('/api/users/likes?id=user-1')
    expect(res.status).toBe(200)
    expect(res.body._count.userLikedArtist).toBe(3)
    expect(res.body._count.userLikedRelease).toBe(5)
    expect(res.body._count.userLikedSong).toBe(10)
  })

  it('returns liked artists when active=artists', async () => {
    prismaMock.userLikedArtist.count.mockResolvedValue(1)
    prismaMock.userLikedRelease.count.mockResolvedValue(0)
    prismaMock.userLikedSong.count.mockResolvedValue(0)
    prismaMock.userLikedArtist.findMany.mockResolvedValue(
      [{ id: 'like-1', artist: { id: 'a1', name: 'Radiohead' } }]
    )

    const res = await request(app).get('/api/users/likes?id=user-1&active=artists')
    expect(res.status).toBe(200)
    expect(res.body.userLikedArtist).toHaveLength(1)
  })
})

// ─── GET /users/profile ───────────────────────────────────────────────────────

describe('GET /api/users/profile', () => {
  const mockUser = {
    id: 'user-1', username: 'john', avatar: null, createdAt: new Date(),
    _count: { followers: 10, following: 5 }
  }

  it('returns profile without auth token (softVerifyUser)', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser)
    prismaMock.userArtistReviews.groupBy.mockResolvedValue([
      { rating: 4, _count: { rating: 3 } }
    ])

    prismaMock.userReleaseReviews.groupBy.mockResolvedValue([
      { rating: 3, _count: { rating: 2 } }
    ])

    prismaMock.userSongReviews.groupBy.mockResolvedValue([
      { rating: 5, _count: { rating: 4 } }
    ])
    prismaMock.follow.findUnique.mockResolvedValue(null)

    const res = await request(app).get('/api/users/profile?profileId=user-1')
    expect(res.status).toBe(200)
  })
})

// ─── GET /users/find (requires auth) ─────────────────────────────────────────

describe('GET /api/users/find', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users/find')
    expect(res.status).toBe(401)
  })

  it('returns user data with valid token', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1', username: 'john', email: 'john@example.com',
      avatar: null, createdAt: new Date()
    })

    const res = await request(app).get('/api/users/find').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body.username).toBe('john')
    expect(res.body.email).toBe('john@example.com')
  })
})

// ─── GET /users/like (requires auth) ─────────────────────────────────────────

describe('GET /api/users/like', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users/like?itemId=a1&type=artist')
    expect(res.status).toBe(401)
  })

  it('returns like status with valid token', async () => {
    prismaMock.userLikedArtist.findUnique.mockResolvedValue({ id: 'like-1' })

    const res = await request(app)
      .get('/api/users/like?itemId=a1&type=artist')
      .set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body.liked).toBe(true)
  })
})

// ─── POST /users/follow (requires auth) ──────────────────────────────────────

describe('POST /api/users/follow', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/users/follow').send({ profileId: 'user-2' })
    expect(res.status).toBe(401)
  })

  it('creates a follow with valid token', async () => {
    prismaMock.follow.create.mockResolvedValue({ followerId: 'user-1', followingId: 'user-2' })

    const res = await request(app)
      .post('/api/users/follow')
      .set('Authorization', authHeader)
      .send({ profileId: 'user-2' })
    expect(res.status).toBe(200)
  })
})

// ─── DELETE /users/unfollow (requires auth) ───────────────────────────────────

describe('DELETE /api/users/unfollow', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).delete('/api/users/unfollow').send({ profileId: 'user-2' })
    expect(res.status).toBe(401)
  })

  it('deletes a follow with valid token', async () => {
    prismaMock.follow.delete.mockResolvedValue({})

    const res = await request(app)
      .delete('/api/users/unfollow')
      .set('Authorization', authHeader)
      .send({ profileId: 'user-2' })
    expect(res.status).toBe(200)
  })
})

// ─── POST /users/like (requires auth) ────────────────────────────────────────

describe('POST /api/users/like', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/users/like').send({})
    expect(res.status).toBe(401)
  })
})

// ─── DELETE /users/like (requires auth) ──────────────────────────────────────

describe('DELETE /api/users/like', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).delete('/api/users/like').send({})
    expect(res.status).toBe(401)
  })
})
