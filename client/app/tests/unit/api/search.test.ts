import axios from 'axios'
import { getSearchResults } from '../../../lib/api/search'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

const params = { q: 'beatles', page: 1, type: null }

describe('getSearchResults', () => {
  it('calls the artists endpoint when selectedTab is "artists"', async () => {
    mockGet.mockResolvedValue({ data: [] })
    await getSearchResults(params, 'artists')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/artists`, { params })
  })

  it('calls the releases endpoint when selectedTab is "releases"', async () => {
    mockGet.mockResolvedValue({ data: [] })
    await getSearchResults(params, 'releases')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/releases`, { params })
  })

  it('calls the users endpoint when selectedTab is "users"', async () => {
    mockGet.mockResolvedValue({ data: [] })
    await getSearchResults(params, 'users')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/users/query`, {
      params: { q: 'beatles', page: 1 },
    })
  })

  it('omits the type param for the users endpoint', async () => {
    mockGet.mockResolvedValue({ data: [] })
    await getSearchResults({ q: 'test', page: 2, type: 'rock' }, 'users')
    const [, config] = mockGet.mock.calls[0]
    expect(config.params).not.toHaveProperty('type')
  })

  it('throws for an unknown selectedTab', async () => {
    await expect(getSearchResults(params, 'playlists')).rejects.toThrow('Unknown Type')
  })

  it('returns the response data', async () => {
    const payload = [{ id: 'a1' }]
    mockGet.mockResolvedValue({ data: payload })
    const result = await getSearchResults(params, 'artists')
    expect(result).toEqual(payload)
  })
})
