const request = require('supertest')

jest.mock('../../prisma/client', () => ({
  userSongReviews: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  userReleaseReviews: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
}))

jest.mock('../../utils/logging', () => ({
  logApiCall: jest.fn(),
  errorApiCall: jest.fn(),
  successApiCall: jest.fn(),
}))

const prisma = require('../../prisma/client')
const app = require('./app')

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = jest.fn()
})

// ─── /artists ────────────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/artists', () => {
  it('returns 400 when q is missing', async () => {
    const res = await request(app).get('/api/musicbrainz/artists')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing query/i)
  })

  it('returns 400 when page is negative', async () => {
    const res = await request(app).get('/api/musicbrainz/artists?q=radiohead&page=-1')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/invalid page/i)
  })

  it('returns 200 with artist data on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        count: 1,
        artists: [{ id: 'a1', type: 'Group', name: 'Radiohead', disambiguation: 'UK band' }],
      }),
    })

    const res = await request(app).get('/api/musicbrainz/artists?q=radiohead&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.suggestions).toHaveLength(1)
    expect(res.body.data.suggestions[0].name).toBe('Radiohead')
    expect(res.body.count).toBe(1)
  })

  it('forwards upstream status when MusicBrainz returns non-ok', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 503 })
    const res = await request(app).get('/api/musicbrainz/artists?q=radiohead&page=1')
    expect(res.status).toBe(503)
  })

  it('returns 400 on fetch network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('network failure'))
    const res = await request(app).get('/api/musicbrainz/artists?q=radiohead&page=1')
    expect(res.status).toBe(400)
  })
})

// ─── /releases ───────────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/releases', () => {
  it('returns 400 when q is missing', async () => {
    const res = await request(app).get('/api/musicbrainz/releases')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing query/i)
  })

  it('returns 200 with release data on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        count: 1,
        'release-groups': [
          {
            id: 'rg1',
            type: 'Album',
            title: 'OK Computer',
            'artist-credit': [{ joinphrase: '', name: 'Radiohead' }],
            'primary-type': 'Album',
            'first-release-date': '1997-05-21',
          },
        ],
      }),
    })

    const res = await request(app).get('/api/musicbrainz/releases?q=OK+Computer&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data.suggestions).toHaveLength(1)
    expect(res.body.data.suggestions[0].title).toBe('OK Computer')
  })
})

// ─── /getArtist ──────────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/getArtist', () => {
  it('returns 400 when id is missing', async () => {
    const res = await request(app).get('/api/musicbrainz/getArtist')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing query/i)
  })

  it('returns 200 with artist data on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'a1',
        gender: null,
        name: 'Radiohead',
        'life-span': { begin: '1985', end: null, ended: false },
        'begin-area': null,
        'end-area': null,
        type: 'Group',
        country: 'GB',
        disambiguation: '',
        relations: [],
        aliases: [],
        genres: [],
      }),
    })

    const res = await request(app).get('/api/musicbrainz/getArtist?id=a1')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Radiohead')
    expect(res.body.id).toBe('a1')
  })

  it('forwards upstream status when MusicBrainz returns non-ok', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 })
    const res = await request(app).get('/api/musicbrainz/getArtist?id=bad-id')
    expect(res.status).toBe(404)
  })
})

// ─── /discography ────────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/discography', () => {
  it('returns 400 when artistId is missing', async () => {
    const res = await request(app).get('/api/musicbrainz/discography?type=album&page=1')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/missing/i)
  })

  it('returns 400 when type is invalid', async () => {
    const res = await request(app).get('/api/musicbrainz/discography?artistId=a1&type=concert&page=1')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/incorrect type/i)
  })

  it('returns 400 when page is less than 1', async () => {
    const res = await request(app).get('/api/musicbrainz/discography?artistId=a1&type=album&page=0')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/page/i)
  })

  it('returns 200 with album discography on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        'release-groups': [
          {
            id: 'rg1',
            title: 'OK Computer',
            'primary-type': 'Album',
            'secondary-types': [],
            'first-release-date': '1997-05-21',
            disambiguation: '',
          },
        ],
        'release-group-count': 1,
      }),
    })

    prisma.userReleaseReviews.aggregate.mockResolvedValue({
      _avg: { rating: 4.5 },
      _count: { rating: 10 },
    })

    const res = await request(app).get('/api/musicbrainz/discography?artistId=a1&type=album&page=1')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].title).toBe('OK Computer')
    expect(res.body.count).toBe(1)
  })
})

// ─── /getSong ────────────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/getSong', () => {
  it('returns 400 when songId is missing', async () => {
    const res = await request(app).get('/api/musicbrainz/getSong')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch("Missing songId")
  })

  it('returns 200 with song data on success', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: '70595637-9310-45f2-a266-58f8de4874a7',
          title: 'Creep',
          length: 238000,
          'first-release-date': '1992-09-21',
          'artist-credit': [{ name: 'Radiohead', joinphrase: '' }],
          genres: [],
          releases: [],
          relations: [],
          disambiguation: '',
          video: false,
        }),
      })

    const res = await request(app).get('/api/musicbrainz/getSong?songId=id')
    expect(res.status).toBe(200)
    expect(res.body.song.title).toBe('Creep')
  })

  it('forwards upstream status when MusicBrainz returns non-ok', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 })
    const res = await request(app).get('/api/musicbrainz/getSong?songId=bad-id')
    expect(res.status).toBe(404)
  })
})

// ─── /findSingleId ───────────────────────────────────────────────────────────

describe('GET /api/musicbrainz/findSingleId', () => {
  it('returns 200 with recording id on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        'release-count': 1,
        releases: [
          {
            status: 'Official',
            date: '2021-01-01',
            disambiguation: '',
            'release-group': { 'first-release-date': '2021-01-01' },
            media: [{ tracks: [{ recording: { id: 'rec-1' } }] }],
          },
        ],
      }),
    })

    const res = await request(app).get('/api/musicbrainz/findSingleId?rgId=rg1')
    expect(res.status).toBe(200)
    expect(res.body).toBe('rec-1')
  })
})
