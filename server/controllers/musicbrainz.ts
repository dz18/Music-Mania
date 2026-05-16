import prisma from '../prisma/client'
import { logApiCall, errorApiCall, successApiCall } from '../utils/logging'
import { formatMedia } from './hooks/formatMedia'
import { scoreRelease } from './hooks/scoreRelease'
import { mbQueue } from '../utils/musicbrainzQue'
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
    buildDiscographyUrl, 
    buildReleaseQueryUrl
} from '../utils/musicbrainz/buildUrl'
import { 
  formatArtist,
    formatQueryArtist, 
    formatQueryRelease,
    sortAndFormatReleaseGroups
} from '../utils/musicbrainz/format'
import { mbFetch } from '../utils/musicbrainz/fetch'
import { ur } from 'zod/locales'

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
    errorApiCall(req, error)
    return res.status(400).json({error : 'Error fetching suggested artists. Refresh results or try again later.'})
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
    errorApiCall(req, error)
    return res.status(400).json({error : 'Error fetching suggested releases. Refresh Results or try again later.'})
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
    if (error.status) {
      errorApiCall(req, `MusicBrainz error: ${error.status}`)
      return res.status(error.status).json({ error: 'MusicBrainz API server returned an error. Try again later or check the artist ID.' })
    }
    errorApiCall(req, error)
    return res.status(400).json({ error: 'Error fetching Artist' })
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
    if (error.status) {
      errorApiCall(req, `MusicBrainz error: ${error.status}`)
      return res.status(error.status).json({ error: 'MusicBrainz API server returned an error. Try again later or check the artist ID.' })
    }
    errorApiCall(req, error)
    return res.status(400).json({ error: 'Error fetching Artist' })
  }
  
}

const discographySingles = async (req: Request, res: Response) => {
  const { artistId, page } = req.validatedQuery as z.infer<typeof discographySinglesSchema>

  logApiCall(req)

  const limit = 100

  try {
    const releases = await mbQueue.add(() => fetch(`https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json&limit=${limit}&offset=${(page - 1) * limit}&inc=release-groups+recordings+recording-level-rels+work-rels+work-level-rels&status=official&type=single`, {
      headers: {
        'User-Agent' : userAgent
      }
    }))
    const data = await releases.json()

    const rgInfo = await mbQueue.add(() => fetch(`http://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=single&limit=${limit}&release-group-status=website-default&offset=${(page - 1) * limit}`, {
      headers: {
        'User-Agent' : userAgent
      }
    }))
    const rgData = await rgInfo.json()
    
    const singles = []
    const seen = new Set()
    for (const r of data.releases) {
      const rgid = r['release-group'].id
      if (seen.has(rgid)) continue

      singles.push(r)
      seen.add(rgid)
    }

    const discog = singles.map(s => {
      const releaseGroup = s['release-group'];
      const firstTrack = s.media?.[0]?.tracks?.[0]?.recording;
      let workId = null;

      if (firstTrack?.relations) {
        const workRel = firstTrack.relations.find(rel => rel.work?.id);
        if (workRel) workId = workRel.work.id;
      }

      return {
        ...releaseGroup,
        workId
      };
    });

    const sorted = await Promise.all(
      discog.sort((a,b) => (
        a['secondary-types']?.length - b['secondary-types']?.length
      )).map(async (rg) => {
        let data = {
          type: rg['secondary-types']?.join(' + ') || rg['primary-type'] || "Unknown",
          id: rg.id,
          workId: rg.workId,
          firstReleaseDate: rg['first-release-date'] || "",
          disambiguation: rg.disambiguation || "",
          title: rg.title,
        }
        if (!rg.workId) {
          return {
            ...data,
            averageRating: null,
            totalReviews: null,
          }
        }
        
        let nums = await prisma.userSongReviews.aggregate({
          where: {songId: rg.workId},
          _avg: {rating: true},
          _count: {rating: true}
        })
        const average = nums._avg.rating
        const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

        return {
          ...data,
          averageRating: nums._avg.rating ? avgRounded : null,
          totalReviews: nums._count.rating ?? 0,
        }

      })
    )

    successApiCall(req)
    const response = {
      data: sorted,
      count: rgData['release-group-count'],
      currentPage: page,
      pages: Math.ceil(rgData['release-group-count'] / 100),
      limit: limit
    }
    // console.log(response)
    res.json(response)
  } catch (error) {
    if (error.cause && error.cause.code === 'ECONNRESET') {
      console.error('[NETWORK ERROR] MusicBrainz connection reset:', error);
      errorApiCall(req, error.message)
      return res.status(502).json({ error: 'Upstream MusicBrainz connection reset'})
    }
    
    console.error('[UNEXPECTED ERROR] Failed fetching release:', error)
    errorApiCall(req, error.message)
    return res.status(500).json({ error: 'Musicbrainz API Failed to fetch artists singles data. Please try again later.' })
  }
}

const getRelease = async (req: Request, res: Response) => {
  const { releaseId } = req.validatedQuery as z.infer<typeof getReleaseSchema>
  
  logApiCall(req)

  try {

    const albums = await mbQueue.add(() => fetch(`https://musicbrainz.org/ws/2/release?release-group=${releaseId}&type=album&status=official&inc=recordings+artist-credits+genres+release-groups+recording-level-rels+work-rels+work-level-rels&fmt=json&limit=100&offset=0`, {
      headers: {
        'User-Agent' : userAgent
      }
    }))

    if (!albums.ok) {
      errorApiCall(req, `MusicBrainz error: ${albums.status}`)
      return res.status(albums.status).json({error: `MusicBrainz server returned an error. Try again later or check the release ID.`})
    }

    const albumsJSON = await albums.json()
    const albumData = albumsJSON.releases

    const formatPriority = ["CD", "Digital Media"]
    const disambiguationPriority = ["clean", "", "explicit"]
    const filteredAlbums = albumData.filter(a => a.title === a['release-group'].title)
    const sorted = [...filteredAlbums].sort((a, b) => {
      
      const aFormat = formatPriority.indexOf(a.media[0]?.format || "")
      const bFormat = formatPriority.indexOf(b.media[0]?.format || "")
      if (aFormat !== bFormat) return bFormat - aFormat

      const aDate = a.date ? new Date(a.date).getTime() : Infinity
      const bDate = b.date ? new Date(b.date).getTime() : Infinity
      if (aDate !== bDate) return bDate - aDate

      const aDisamb = disambiguationPriority.indexOf(a.disambiguation || "")
      const bDisamb = disambiguationPriority.indexOf(b.disambiguation || "")
      if (aDisamb !== bDisamb) return bDisamb - aDisamb

      const aLength = a.disambiguation.length
      const bLength = b.disambiguation.length
      return aLength - bLength
    })
    .map(album => {

      return {
        releaseId: album.id,
        id: album['release-group'].id,
        title: album['release-group'].title,
        coverArtArchive: album['cover-art-archive'].artwork,
        disambiguation: album.disambiguation,
        date: album['release-group']['first-release-date'],
        media: album.media.map(m => formatMedia(m)),
        trackCount: album.media.reduce((sum, m) => sum + (m['track-count'] ?? 0), 0),
        artistCredit: album['artist-credit'],
        language: album['text-representation'].language,
        type: album['release-group']['secondary-types'].length !== 0 ? album['release-group']['secondary-types'] : [album['release-group']['primary-type']],
        genres: album['release-group']['genres']
      }
    })

    const first = sorted[0]

    const stats = await Promise.all(
      first.media.map(m =>
        Promise.all(
          m.tracks.map(t =>
            prisma.userSongReviews.aggregate({
              where: { songId: t.recording.workId },
              _count: { rating: true },
              _avg: { rating: true }
            })
          )
        )
      )
    )
    
    first.media = first.media.map((m, discIndex) => ({
      ...m,
      tracks: m.tracks.map((t, trackIndex) => {
        const stat = stats[discIndex][trackIndex]

        return {
          ...t,
          recording: {
            ...t.recording,
            totalReviews: stat._count.rating,
            avgRating:
              stat._count.rating > 0
                ? Number(stat._avg.rating).toFixed(2)
                : null
          }
        }
      })
    }))

    const FetchCoverArt = await mbQueue.add(() => fetch(`https://coverartarchive.org/release-group/${releaseId}`))

    let coverArt = null
    if (FetchCoverArt.ok) {
      const coverArtJSON = await FetchCoverArt.json()
      coverArt = coverArtJSON.images.filter(img => img.front === true)
    }

    successApiCall(req)
    return res.json({
      release: first,
      coverArtUrl: coverArt && coverArt[0].image
    })

  } catch (error) {
    if (error.cause && error.cause.code === 'ECONNRESET') {
      console.error('[NETWORK ERROR] MusicBrainz connection reset:', error);
      errorApiCall(req, error.message)
      return res.status(502).json({ error: 'Upstream MusicBrainz connection reset'})
    }
    
    console.error('[UNEXPECTED ERROR] Failed fetching release:', error)
    errorApiCall(req, error.message)
    return res.status(500).json({ error: 'Musicbrainz API Failed to fetch release data. Please Try Again Later' })
  }
}

const getSong = async (req: Request, res: Response) => {
  const { songId } = req.validatedQuery as z.infer<typeof getSongSchema>

  logApiCall(req)

  if (!songId) {
    errorApiCall(req, 'Missing songId')
    return res.status(400).json({error : 'Missing songId'})
  }

  try {

    const fetchSong = await mbQueue.add(() => fetch(`https://musicbrainz.org/ws/2/recording/${songId}?fmt=json&inc=artist-rels+artist-credits+genres+releases+release-groups+work-rels&status=official`, {
      headers: {
        'User-Agent': userAgent
      }
    }))

    if (!fetchSong.ok) {
      errorApiCall(req, `MusicBrainz error: ${fetchSong.status}`)
      return res.status(fetchSong.status).json({error: `MusicBrainz server returned an error. Try again later or check the song ID.`})
    }

    const song = await fetchSong.json()

    song.releases.sort((a, b) => {
      const weight = (r) => r['release-group']?.["primary-type"] === 'Single' ? 0 : 1
      return weight(a) - weight(b) 
    })

    let coverArtUrl = ''
    if (song.releases.length !== 0) {
      const albumId = song.releases[0]['release-group'].id

      const fetchCoverArt = await mbQueue.add(() => fetch(
        `https://coverartarchive.org/release-group/${albumId}`
      ))

      if (fetchCoverArt.ok) {
        const coverArtJSON = await fetchCoverArt.json()

        const coverArt = coverArtJSON.images?.find(
          img => img.front === true
        )

        if (coverArt) {
          coverArtUrl = coverArt.image
        }
      } 
      // else {
      //   console.log(
      //     `No cover art found for release-group ${albumId}`
      //   )
      // }
    }

    let partOf
    const seen = new Set()
    const rgs = []
    for (const r of song.releases) {
      const type = r['release-group']['primary-type']
      if (seen.has(type) || type == 'Single' ) continue
      seen.add(r['release-group']['primary-type'])

      rgs.push({
        type: r["release-group"]["primary-type"],
        id: r["release-group"].id,
        name: r["release-group"].title
      })
    }
    partOf = rgs

    const workRel = song?.relations?.find(
      rel => rel['target-type'] === 'work' && rel.work?.id
    )
    const workId = workRel?.work?.id ?? song.id
    const songFormatted = {
      id: song.id,
      artistCredit: song['artist-credit'],
      genres: song.genres,
      length: song.length,
      title: song.title,
      firstReleaseDate: song['first-release-date'],
      partOf: partOf,
      disambiguation: song.disambiguation,
      video: song.video,
      workId: workId
    }
    // console.log(songFormatted)
    successApiCall(req)
    return res.json({
      song: songFormatted, 
      coverArtUrl
    })
  } catch (error) {
    if (error.cause && error.cause.code === 'ECONNRESET') {
      console.error('[NETWORK ERROR] MusicBrainz connection reset:', error);
      errorApiCall(req, error.message)
      return res.status(502).json({ error: 'Upstream MusicBrainz connection reset'})
    }
    
    console.error('[UNEXPECTED ERROR] Failed fetching release:', error)
    errorApiCall(req, error.message)
    return res.status(500).json({ error: 'Failed to fetch release data.' })
  }
}

const findSingleId = async (req: Request, res: Response) => {
  const { rgId } = req.validatedQuery as z.infer<typeof findSingleIdSchema>

  logApiCall(req)

  try {
    const fetchSingle = await mbQueue.add(() => fetch(`https://musicbrainz.org/ws/2/release?release-group=${rgId}&status=official&type=single&inc=release-groups+recordings&fmt=json`, {
      headers: {
        'User-Agent': userAgent
      }
    }))

    if (!fetchSingle.ok) {
      errorApiCall(req, `MusicBrainz error: ${fetchSingle.status}`)
      return res.status(fetchSingle.status).json({error: `MusicBrainz API server returned an error. Try again later or check the artist ID.`})
    }

    const single = await fetchSingle.json()

    if (single['release-count'] === 0) {
      res.status(404).json({error : 'No Recordings found'})
    }
   
    const mostOfficialRelease = single.releases
      .filter(r => r.status === 'Official')
      .sort((a, b) => scoreRelease(b) - scoreRelease(a))[0]
    const recording = mostOfficialRelease.media[0].tracks[0].recording.id

    successApiCall(req)
    return res.json(recording)

  } catch (error) {
    errorApiCall(req, error)
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