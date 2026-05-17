import prisma from '../prisma/client'
import { logApiCall, errorApiCall, successApiCall, handleMbError } from '../utils/logging/logging'
import { formatMedia } from './hooks/formatMedia'
import { scoreRelease } from './hooks/scoreRelease'
import { mbQueue } from '../utils/musicbrainz/musicbrainzQue'
import { Request, Response } from 'express'
import z from 'zod'
import { 
    artistsSchema, 
    discographySchema, 
    discographySinglesSchema, 
    findSingleIdSchema, 
    getArtistsSchema, 
    getReleaseSchema, 
    getSongSchema, 
    releasesSchema 
} from '../schemas/musicbrainz.schema'
import { 
    buildArtistQueryUrl, 
    buildArtistUrl, 
    buildCoverArtUrl, 
    buildDiscographyUrl, 
    buildFindSingleUrl, 
    buildReleaseQueryUrl,
    buildReleaseUrl,
    buildSinglesRgUrl,
    buildSinglesUrl,
    buildSongUrl
} from '../utils/musicbrainz/buildUrl'
import { 
  attachTrackRatings,
  dedupeByReleaseGroup,
  extractMostOfficialRecording,
  formatArtist,
    formatQueryArtist, 
    formatQueryRelease,
    formatRelease,
    formatSong,
    sortAndFormatReleaseGroups,
    sortAndFormatSingles,
    sortReleases,
    sortReleasesByType
} from '../utils/musicbrainz/format'
import { fetchCoverArt, fetchSongCoverArt, mbFetch } from '../utils/musicbrainz/fetch'
import { getMediaRatings } from '../utils/prisma/ratings'

const userAgent = process.env.USER_AGENT

const artists = async (req: Request, res: Response) => {
  logApiCall(req) 

  const { q, type, page } = req.validatedQuery as z.infer<typeof artistsSchema>
  const limit = 50

  try {

    const url = buildArtistQueryUrl(q, type, page, limit)
    const data = await mbFetch(url)
    successApiCall(req)

    return res.json({
      data: { suggestions: data.artists.map(formatQueryArtist) },
      count: data.count,
      currentPage: page,
      pages: Math.ceil(data.count / limit),
      limit,
    })

  } catch (error) {
    return handleMbError(req, res, error)  
  }
}

const releases = async (req: Request, res: Response) => {
  logApiCall(req)

  const { q, type, page} = req.validatedQuery as z.infer<typeof releasesSchema>
  const limit = 50

  try {

    const url = buildReleaseQueryUrl(q, type, page, limit)
    const data = await mbFetch(url)

    successApiCall(req)
    return res.json({
      data: { suggestions: data['release-groups'].map(formatQueryRelease) },
      count: data.count,
      limit: limit,
      currentPage: page,
      pages: Math.ceil(data.count / limit)
    })

  } catch (error) {
    return handleMbError(req, res, error)  
  }

}

const getArtist = async (req: Request, res: Response) => {
  logApiCall(req)
  const { id } = req.validatedQuery as z.infer<typeof getArtistsSchema>

  try {
    const url = buildArtistUrl(id)
    const artistData = await mbFetch(url)
    successApiCall(req)
    
    return res.json(formatArtist(artistData))
  } catch (error: any) {
    return handleMbError(req, res, error)  
  }
}

const discography = async (req: Request, res: Response) => {
  logApiCall(req)

  const { artistId, type, page } = req.validatedQuery as z.infer<typeof discographySchema>
  const limit = 25

  try {

    const url = buildDiscographyUrl(artistId, type, page, limit)
    const data = await mbFetch(url)
    const sorted = await sortAndFormatReleaseGroups(data['release-groups'], type)

    successApiCall(req)
      return res.json({
      data: sorted,
      count: data['release-group-count'],
      currentPage: page,
      pages: Math.ceil(data['release-group-count'] / limit),
      limit,
    })

  } catch (error: any) {
    return handleMbError(req, res, error)  
  }
  
}

const discographySingles = async (req: Request, res: Response) => {
  logApiCall(req)
  const { artistId, page } = req.validatedQuery as z.infer<typeof discographySinglesSchema>
  const limit = 100

  try {
    const [releasesData, rgData] = await Promise.all([
      mbFetch(buildSinglesUrl(artistId, page, limit)),
      mbFetch(buildSinglesRgUrl(artistId, page, limit))
    ])

    const dedupedSingles = dedupeByReleaseGroup(releasesData.releases)
    const sorted = await sortAndFormatSingles(dedupedSingles)

    successApiCall(req)
    return res.json({
      data: sorted,
      count: rgData['release-group-count'],
      currentPage: page,
      pages: Math.ceil(rgData['release-group-count'] / limit),
      limit,
    })
  } catch (error: any) {
    return handleMbError(req, res, error)
  }
}

const getRelease = async (req: Request, res: Response) => {
  logApiCall(req)
  const { releaseId } = req.validatedQuery as z.infer<typeof getReleaseSchema>

  try {
    
    const albumsData = await mbFetch(buildReleaseUrl(releaseId))
    const filtered = albumsData.releases.filter((a: any) => a.title === a['release-group'].title)
    const sorted = sortReleases(filtered).map(formatRelease)
    const first = sorted[0]

    const [stats, coverArt] = await Promise.all([
      getMediaRatings(first.media),
      fetchCoverArt(buildCoverArtUrl(releaseId))
    ])

    first.media = attachTrackRatings(first.media, stats)

    successApiCall(req)
    return res.json({ release: first, coverArtUrl: coverArt })

  } catch (error: any) {
    return handleMbError(req, res, error)
  }
}

const getSong = async (req: Request, res: Response) => {
  const { songId } = req.validatedQuery as z.infer<typeof getSongSchema>

  logApiCall(req)

  try {

    const song = await mbFetch(buildSongUrl(songId))
    const sortedReleases = sortReleasesByType(song.releases)
    song.releases = sortedReleases

    const [coverArtUrl] = await Promise.all([
      fetchSongCoverArt(sortedReleases)
    ])

    successApiCall(req)
    return res.json({ song: formatSong(song), coverArtUrl })  
  } catch (error) {
    return handleMbError(req, res, error)  
  }
}

const findSingleId = async (req: Request, res: Response) => {
  logApiCall(req)
  const { rgId } = req.validatedQuery as z.infer<typeof findSingleIdSchema>

  try {
    const data = await mbFetch(buildFindSingleUrl(rgId))

    if (data['release-count'] === 0) {
      return res.status(404).json({ error: 'No recordings found' })
    }

    const recording = extractMostOfficialRecording(data.releases)
    if (!recording) {
      return res.status(404).json({ error: 'No official recording found' })
    }

    successApiCall(req)
    return res.json(recording)
  } catch (error: any) {
    return handleMbError(req, res, error)
  }
}

export default {
  artists,
  releases,
  getArtist,
  getRelease,
  getSong,
  discography,
  discographySingles,
  findSingleId
}