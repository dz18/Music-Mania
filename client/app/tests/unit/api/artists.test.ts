import axios from 'axios'
import { getArtist, artistReviewsQuery } from '../../../lib/api/artists'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('getArtist', () => {
  it('calls the correct endpoint with id param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getArtist({ id: 'artist-1' })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/getArtist`, {
      params: { id: 'artist-1' },
    })
  })

  it('returns the response data', async () => {
    const artist = { id: 'artist-1', name: 'The Beatles' }
    mockGet.mockResolvedValue({ data: artist })
    const result = await getArtist({ id: 'artist-1' })
    expect(result).toEqual(artist)
  })
})

describe('artistReviewsQuery', () => {
  it('calls the correct endpoint with all params', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await artistReviewsQuery({ id: 'artist-1', star: null, page: 1 })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/artist`, {
      params: { id: 'artist-1', star: null, page: 1 },
    })
  })

  it('forwards star filter param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await artistReviewsQuery({ id: 'artist-1', star: '4', page: 2 })
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      { params: { id: 'artist-1', star: '4', page: 2 } }
    )
  })

  it('returns the response data', async () => {
    const payload = { reviews: [{ id: 'r1' }], total: 1 }
    mockGet.mockResolvedValue({ data: payload })
    const result = await artistReviewsQuery({ id: 'artist-1', star: null, page: 1 })
    expect(result).toEqual(payload)
  })
})
