import axios from 'axios'
import { getLandingStats } from '../../../lib/api/stats'
import type { LandingStats } from '../../../lib/api/stats'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('getLandingStats', () => {
  const payload: LandingStats = {
    topReviewedArtists: [{ id: 'a1', name: 'Radiohead', count: 12 }],
    topLikedArtists: [{ id: 'a2', name: 'Portishead', count: 8 }],
    topLikedReleases: [
      {
        id: 'r1',
        title: 'OK Computer',
        artistCredit: [{ name: 'Radiohead' }],
        coverArt: 'https://example.com/cover.jpg',
        count: 5,
      },
    ],
  }

  it('calls the correct endpoint', async () => {
    mockGet.mockResolvedValue({ data: payload })
    await getLandingStats()
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/stats/landing`)
  })

  it('returns the response data', async () => {
    mockGet.mockResolvedValue({ data: payload })
    const result = await getLandingStats()
    expect(result).toEqual(payload)
  })

  it('propagates axios errors', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'))
    await expect(getLandingStats()).rejects.toThrow('Network Error')
  })
})
