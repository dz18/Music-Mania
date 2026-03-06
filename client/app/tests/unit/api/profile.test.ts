import axios from 'axios'
import {
  fetchProfile,
  fetchTab,
  fetchUserArtistReviews,
  fetchUserReleaseReviews,
  fetchUserSongReviews,
  fetchLikes,
} from '../../../lib/api/profile'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('fetchProfile', () => {
  it('calls the correct endpoint with profileId and Bearer token', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchProfile('profile-1', 'my-token')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/profile`, {
      params: { profileId: 'profile-1' },
      headers: { Authorization: 'Bearer my-token' },
    })
  })

  it('handles a null token', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchProfile('profile-1', null)
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { Authorization: 'Bearer null' } })
    )
  })

  it('returns the response data', async () => {
    const profile = { id: 'profile-1', username: 'john' }
    mockGet.mockResolvedValue({ data: profile })
    expect(await fetchProfile('profile-1', 'token')).toEqual(profile)
  })
})

describe('fetchTab', () => {
  const params = { profileId: 'profile-1', page: 1, star: null }

  it('calls the artist reviews endpoint for "artistReviews"', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchTab('artistReviews', params)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/artists`, { params })
  })

  it('calls the release reviews endpoint for "releaseReviews"', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchTab('releaseReviews', params)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/releases`, { params })
  })

  it('calls the song reviews endpoint for "songReviews"', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchTab('songReviews', params)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/songs`, { params })
  })

  it('throws for an invalid tab', async () => {
    await expect(fetchTab('invalidTab' as any, params)).rejects.toThrow('Invalid tab')
  })

  it('returns the response data', async () => {
    const payload = { reviews: [{ id: 'r1' }], total: 1 }
    mockGet.mockResolvedValue({ data: payload })
    expect(await fetchTab('artistReviews', params)).toEqual(payload)
  })
})

describe('fetchUserArtistReviews', () => {
  it('calls the artist reviews endpoint', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchUserArtistReviews({ profileId: 'p1', page: 1, star: null })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/artists`, {
      params: { profileId: 'p1', page: 1, star: null },
    })
  })
})

describe('fetchUserReleaseReviews', () => {
  it('calls the release reviews endpoint', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchUserReleaseReviews({ profileId: 'p1', page: 1, star: '3' })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/releases`, {
      params: { profileId: 'p1', page: 1, star: '3' },
    })
  })
})

describe('fetchUserSongReviews', () => {
  it('calls the song reviews endpoint', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchUserSongReviews({ profileId: 'p1', page: 2, star: null })
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/reviews/user/songs`, {
      params: { profileId: 'p1', page: 2, star: null },
    })
  })
})

describe('fetchLikes', () => {
  it('calls the likes endpoint with profileId and active type', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await fetchLikes('profile-1', 'artist')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/likes`, {
      params: { id: 'profile-1', active: 'artist' },
    })
  })

  it('returns the response data', async () => {
    const payload = { likes: [] }
    mockGet.mockResolvedValue({ data: payload })
    expect(await fetchLikes('profile-1', 'release')).toEqual(payload)
  })
})
