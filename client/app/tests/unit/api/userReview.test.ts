import axios from 'axios'
import { getUserReview, saveReview, deleteReview } from '../../../lib/api/userReview'

jest.mock('axios', () => ({ get: jest.fn(), put: jest.fn(), delete: jest.fn() }))

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => jest.clearAllMocks())

describe('getUserReview', () => {
  it('calls the correct endpoint with params and Bearer token', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getUserReview({ itemId: 'item-1', type: 'artist' }, 'my-token')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/review`, {
      params: { itemId: 'item-1', type: 'artist' },
      headers: { Authorization: 'Bearer my-token' },
    })
  })

  it('handles a null token', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getUserReview({ itemId: 'item-1', type: 'song' }, null)
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { Authorization: 'Bearer null' } })
    )
  })

  it('returns the response data', async () => {
    const review = { id: 'r1', rating: 4 }
    mockGet.mockResolvedValue({ data: review })
    const result = await getUserReview({ itemId: 'item-1', type: 'artist' }, 'token')
    expect(result).toEqual(review)
  })
})

describe('saveReview', () => {
  const body = { type: 'artist', itemId: 'a1', rating: 4, title: 'Great', review: 'text', status: 'PUBLISHED', tags: [] }

  it('calls PUT on the correct endpoint with body and Bearer token', async () => {
    mockPut.mockResolvedValue({ data: { success: true } })
    await saveReview(body as any, 'my-token')
    expect(mockPut).toHaveBeenCalledWith(
      `${BASE}/api/reviews`,
      body,
      { headers: { Authorization: 'Bearer my-token' } }
    )
  })

  it('returns the response data', async () => {
    const response = { id: 'r1', status: 'PUBLISHED' }
    mockPut.mockResolvedValue({ data: response })
    const result = await saveReview(body as any, 'my-token')
    expect(result).toEqual(response)
  })
})

describe('deleteReview', () => {
  it('calls DELETE on the correct endpoint with params and Bearer token', async () => {
    mockDelete.mockResolvedValue({})
    await deleteReview({ itemId: 'item-1', type: 'release' }, 'my-token')
    expect(mockDelete).toHaveBeenCalledWith(`${BASE}/api/reviews`, {
      headers: { Authorization: 'Bearer my-token' },
      params: { itemId: 'item-1', type: 'release' },
    })
  })

  it('works for all review types', async () => {
    mockDelete.mockResolvedValue({})
    for (const type of ['artist', 'release', 'song'] as const) {
      await deleteReview({ itemId: 'x', type }, 'token')
      expect(mockDelete).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ params: expect.objectContaining({ type }) })
      )
    }
  })
})
