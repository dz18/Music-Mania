import axios from 'axios'
import { getArtist, getDiscography } from '../../../lib/api/discography'

jest.mock('axios', () => ({ get: jest.fn() }))

const mockGet = axios.get as jest.Mock
const BASE = 'http://localhost:5000'

beforeEach(() => mockGet.mockClear())

describe('getArtist', () => {
  it('calls the correct endpoint with id param', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getArtist('artist-1')
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/getArtist`, {
      params: { id: 'artist-1' },
    })
  })

  it('returns the response data', async () => {
    const artist = { id: 'artist-1', name: 'Kendrick Lamar' }
    mockGet.mockResolvedValue({ data: artist })
    const result = await getArtist('artist-1')
    expect(result).toEqual(artist)
  })
})

describe('getDiscography', () => {
  it('calls the singles endpoint when active is "single"', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getDiscography('artist-1', 'single', 1)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/discographySingles`, {
      params: { artistId: 'artist-1', type: 'single', page: 1 },
    })
  })

  it('calls the discography endpoint for non-single types', async () => {
    mockGet.mockResolvedValue({ data: {} })
    await getDiscography('artist-1', 'album', 2)
    expect(mockGet).toHaveBeenCalledWith(`${BASE}/api/musicbrainz/discography`, {
      params: { artistId: 'artist-1', type: 'album', page: 2 },
    })
  })

  it('returns the response data for singles', async () => {
    const payload = { releases: [{ id: 'r1' }] }
    mockGet.mockResolvedValue({ data: payload })
    const result = await getDiscography('artist-1', 'single', 1)
    expect(result).toEqual(payload)
  })

  it('returns the response data for albums', async () => {
    const payload = { releases: [{ id: 'r2' }] }
    mockGet.mockResolvedValue({ data: payload })
    const result = await getDiscography('artist-1', 'album', 1)
    expect(result).toEqual(payload)
  })
})
