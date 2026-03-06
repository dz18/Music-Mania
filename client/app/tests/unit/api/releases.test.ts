import axios from 'axios'
import { getRelease, releaseReviewsQuery } from '../../../lib/api/releases'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('getRelease', () => {
  it('calls the correct endpoint with releaseId param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getRelease('release-1')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/getRelease`, {
      params: { releaseId: 'release-1' },
    })
  })

  it('returns the response data', async () => {
    const release = { id: 'release-1', title: 'Abbey Road' }
    mockGet.mockResolvedValue({ data: release })
    const result = await getRelease('release-1')
    expect(result).toEqual(release)
  })
})

describe('releaseReviewsQuery', () => {
  it('calls the correct endpoint with all params', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await releaseReviewsQuery({ id: 'release-1', star: null, page: 1 })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/release`, {
      params: { id: 'release-1', star: null, page: 1 },
    })
  })

  it('forwards the star filter param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await releaseReviewsQuery({ id: 'release-1', star: '5', page: 3 })
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      { params: { id: 'release-1', star: '5', page: 3 } }
    )
  })

  it('returns the response data', async () => {
    const payload = { reviews: [], total: 0 }
    mockGet.mockResolvedValue({ data: payload })
    const result = await releaseReviewsQuery({ id: 'release-1', star: null, page: 1 })
    expect(result).toEqual(payload)
  })
})
