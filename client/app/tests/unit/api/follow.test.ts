import axios from 'axios'
import { follow, unfollow, fetchFollowers } from '../../../lib/api/follow'

jest.mock('axios', () => ({ post: jest.fn(), delete: jest.fn(), get: jest.fn() }))

const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => jest.clearAllMocks())

describe('follow', () => {
  it('calls POST with profileId in body and Bearer token', async () => {
    mockPost.mockResolvedValue({})
    await follow('profile-1', 'my-token')
    expect(mockPost).toHaveBeenCalledWith(
      `${BASE}/api/users/follow`,
      { profileId: 'profile-1' },
      { headers: { Authorization: 'Bearer my-token' } }
    )
  })

  it('resolves without returning a value', async () => {
    mockPost.mockResolvedValue({})
    const result = await follow('profile-1', 'my-token')
    expect(result).toBeUndefined()
  })
})

describe('unfollow', () => {
  it('calls DELETE with profileId in data and Bearer token', async () => {
    mockDelete.mockResolvedValue({})
    await unfollow('profile-1', 'my-token')
    expect(mockDelete).toHaveBeenCalledWith(
      `${BASE}/api/users/unfollow`,
      {
        data: { profileId: 'profile-1' },
        headers: { Authorization: 'Bearer my-token' },
      }
    )
  })

  it('resolves without returning a value', async () => {
    mockDelete.mockResolvedValue({})
    const result = await unfollow('profile-1', 'my-token')
    expect(result).toBeUndefined()
  })
})

describe('fetchFollowers', () => {
  const params = { profileId: 'profile-1', page: 1, userId: 'user-1', following: false }

  it('calls the correct endpoint with all params', async () => {
    mockGet.mockResolvedValue({ data: { followers: [] } })
    await fetchFollowers(params)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/allFollowers`, { params })
  })

  it('handles a null userId', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchFollowers({ ...params, userId: null })
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      { params: expect.objectContaining({ userId: null }) }
    )
  })

  it('returns the response data', async () => {
    const payload = { followers: [{ id: 'u1' }], total: 1 }
    mockGet.mockResolvedValue({ data: payload })
    const result = await fetchFollowers(params)
    expect(result).toEqual(payload)
  })
})
