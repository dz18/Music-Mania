import axios from 'axios'
import { getSong, songReviewsQuery } from '../../../lib/api/songs'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('getSong', () => {
  it('calls the correct endpoint with songId param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getSong('song-1')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/getSong`, {
      params: { songId: 'song-1' },
    })
  })

  it('returns the response data', async () => {
    const song = { id: 'song-1', title: 'Hey Jude' }
    mockGet.mockResolvedValue({ data: song })
    const result = await getSong('song-1')
    expect(result).toEqual(song)
  })
})

describe('songReviewsQuery', () => {
  it('calls the correct endpoint with all params', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await songReviewsQuery({ songId: 'song-1', workId: 'work-1', star: null, page: 1 })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/song`, {
      params: { songId: 'song-1', workId: 'work-1', star: null, page: 1 },
    })
  })

  it('forwards a null workId', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await songReviewsQuery({ songId: 'song-1', workId: null, star: null, page: 1 })
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      { params: { songId: 'song-1', workId: null, star: null, page: 1 } }
    )
  })

  it('returns the response data', async () => {
    const payload = { reviews: [{ id: 'r1' }], total: 1 }
    mockGet.mockResolvedValue({ data: payload })
    const result = await songReviewsQuery({ songId: 'song-1', workId: null, star: '3', page: 1 })
    expect(result).toEqual(payload)
  })
})
