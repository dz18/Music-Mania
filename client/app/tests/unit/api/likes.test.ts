import axios from 'axios'
import { getItemsTotalLikes, checkUserLike, likeItem, deleteLikedItem } from '../../../lib/api/likes'

jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }))

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => jest.clearAllMocks())

describe('getItemsTotalLikes', () => {
  it('returns undefined (not yet implemented)', async () => {
    const result = await getItemsTotalLikes()
    expect(result).toBeUndefined()
  })
})

describe('checkUserLike', () => {
  it('calls the correct endpoint with params and Bearer token', async () => {
    mockGet.mockResolvedValue({ data: { liked: true } })
    await checkUserLike({ itemId: 'item-1', type: 'artist' }, 'my-token')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/like`, {
      params: { itemId: 'item-1', type: 'artist' },
      headers: { Authorization: 'Bearer my-token' },
    })
  })

  it('returns the response data', async () => {
    const payload = { liked: false }
    mockGet.mockResolvedValue({ data: payload })
    const result = await checkUserLike({ itemId: 'item-1', type: 'song' }, 'token')
    expect(result).toEqual(payload)
  })
})

describe('likeItem', () => {
  const body = {
    itemId: 'item-1',
    type: 'artist' as const,
    name: 'The Beatles',
    title: null,
    artistCredit: null,
    coverArt: null,
  }

  it('calls POST with body and Bearer token', async () => {
    mockPost.mockResolvedValue({ data: { success: true } })
    await likeItem(body, 'my-token')
    expect(mockPost).toHaveBeenCalledWith(
      `${BASE}/api/users/like`,
      body,
      { headers: { Authorization: 'Bearer my-token' } }
    )
  })

  it('returns the response data', async () => {
    const payload = { id: 'like-1' }
    mockPost.mockResolvedValue({ data: payload })
    const result = await likeItem(body, 'token')
    expect(result).toEqual(payload)
  })
})

describe('deleteLikedItem', () => {
  it('calls DELETE with data and Bearer token', async () => {
    mockDelete.mockResolvedValue({})
    await deleteLikedItem({ itemId: 'item-1', type: 'release' }, 'my-token')
    expect(mockDelete).toHaveBeenCalledWith(`${BASE}/api/users/like`, {
      data: { itemId: 'item-1', type: 'release' },
      headers: { Authorization: 'Bearer my-token' },
    })
  })

  it('resolves without returning a value', async () => {
    mockDelete.mockResolvedValue({})
    const result = await deleteLikedItem({ itemId: 'item-1', type: 'song' }, 'token')
    expect(result).toBeUndefined()
  })
})
