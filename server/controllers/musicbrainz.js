const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')
const { formatMedia } = require('./hooks/formatMedia')
const { scoreRelease } = require('./hooks/scoreRelease')

const userAgent = process.env.USER_AGENT

const artists = async (req, res) => {
  const { q, type } = req.query
  const page = Number(req.query.page) ?? 1
  
  const limit = 50

  logApiCall(req)

  if (!q) {
    errorApiCall(req, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  if (page < 0) {
    errorApiCall(req, 'Invalid Page number')
    return res.status(400).json({error : 'Invalid Page number'})
  }

  try {
    const query = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${q}${type && ` AND (type:${type})`}&fmt=json&limit=${limit}&offset=${(page - 1) * limit}`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    if (!query.ok) {
      errorApiCall(req, `MusicBrainz error: ${query.status}`)
      return res.status(query.status).json({error: `MusicBrainz server returned an error. Try again later.`})
    }

    const data = await query.json()

    const artists = []
    for (const artist of data.artists) {
      const filtered = {
        id: artist.id,
        type: artist.type,
        name: artist.name,
        disambiguation: artist.disambiguation
      }
      artists.push(filtered)
    }

    successApiCall(req)
    return res.json({
      data: {suggestions: artists},
      count: data.count,
      currentPage: page,
      pages: Math.ceil(data.count / limit),
      limit: limit
    })

  } catch (error) {
    errorApiCall(req, error)
    return res.status(400).json({error : 'Error fetching suggested artists. Refresh results or try again later.'})
  }
}

const releases = async (req, res) => {
  const { q, type } = req.query
  const page = Number(req.query.page) ?? 1

  const limit = 50

  logApiCall(req)

  if (!q) {
    errorApiCall(req, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  try {

    const query = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=${q} AND ${type ? `(primarytype:${type})` : '(primarytype:album OR primarytype:ep)'}&inc=artist-credits&fmt=json&limit=${limit}&offset=${(page - 1) * limit}`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    if (!query.ok) {
      errorApiCall(req, `MusicBrainz error: ${query.status}`)
      return res.status(query.status).json({error: `MusicBrainz server returned an error. Try again later or check the release ID.`})
    }

    const data = await query.json()

    const filtered = []
    for (const f of data['release-groups']) {
      filtered.push({
        id: f.id,
        type: f.type,
        title: f.title,
        artistCredit: f['artist-credit'].map(ac => ({
          joinphrase: ac.joinphrase, name: ac.name
        })),
        primaryType: f['primary-type'],
        firstReleaseDate: f['first-release-date']
      })
    }

    successApiCall(req)
    return res.json({
      data: { suggestions: filtered },
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

const getArtist = async (req, res) => {
  const { id } = req.query

  logApiCall(req)

  if (!id) {
    errorApiCall(req, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  const validURLTypes = [
    'allmusic',
    'IMDb',
    'myspace',
    'official homepage',
    'social network',
    'songkick',
    'soundcloud',
    'streaming',
    'video channel',
    'wikidata',
    'wikipedia',
    'youtube',
    'youtube music',
    'lyrics',
    'image'
  ]

  try {

    const fetchArtist = await fetch(`https://musicbrainz.org/ws/2/artist/${id}?inc=aliases+genres+artist-rels+url-rels&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    if (!fetchArtist.ok) {
      errorApiCall(req, `MusicBrainz error: ${fetchArtist.status}`)
      return res.status(fetchArtist.status).json({error: `MusicBrainz server returned an error. Try again later or check the artist ID.`})
    }

    const artistData = await fetchArtist.json()

    if (!artistData) {
      errorApiCall(req, 'Musicbrainz API failed')
    }

    const membersOfband = []
    const URLRelations = []
    const membersSet = new Set()
    for(const relation of artistData.relations) {
      if(relation.type.includes('member')) {
        if (membersSet.has(relation.artist.id)) continue

        membersOfband.push({
          lifeSpan: {
            begin: relation.begin,
            end: relation.end,
            ended: relation.ended
          },
          artist: {
            type: relation.artist.type,
            id: relation.artist.id,
            name: relation.artist.name,
            country: relation.artist.country,
            disambiguation: relation.artist.disambiguation
          }
        })

        membersSet.add(relation.artist.id)
      } else if (validURLTypes.includes(relation.type) && relation.url) {
        if (relation.type === 'social network') {
          if (relation.url.resource.includes('instagram') ) {
            URLRelations.push({
              type: 'instagram',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('twitter')) {
            URLRelations.push({
              type: 'twitter',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('myspace')) {
            URLRelations.push({
              type: 'myspace',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('google')) {
            URLRelations.push({
              type: 'google',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('tiktok')) {
            URLRelations.push({
              type: 'tiktok',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('snapchat')) {
            URLRelations.push({
              type: 'snapchat',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('vk')) {
            URLRelations.push({
              type: 'vk',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('facebook')) {
            URLRelations.push({
              type: 'facebook',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('threads')) {
            URLRelations.push({
              type: 'threads',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('weibo')) {
            URLRelations.push({
              type: 'threads',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'social network',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'streaming') {
          if (relation.url.resource.includes('amazon')) {
            URLRelations.push({
              type: 'amazon',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('spotify')) {
            URLRelations.push({
              type: 'spotify',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('napster')) {
            URLRelations.push({
              type: 'napster',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('apple')) {
            URLRelations.push({
              type: 'apple',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('tidal')) {
            URLRelations.push({
              type: 'tidal',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'streaming',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'lyrics') {
          if (relation.url.resource.includes('genius')) {
            URLRelations.push({
              type: 'genius',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'lyrics',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'video channel'){
          if (relation.url.resource.includes('dailymotion')) {
            URLRelations.push({
              type: 'dailymotion',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('vimeo')){
            URLRelations.push({
              type: 'vimeo',
              url: relation.url.resou
            })
          } else {
            URLRelations.push({
              type: 'video channel',
              url: relation.url.resource
            })
          }
        } else {
          URLRelations.push({
            type: relation.type,
            url: relation.url.resource
          })
        }
      }
    }

    const artist = {
      id: artistData.id,
      gender: artistData.gender,
      name: artistData.name,
      lifeSpan: artistData['life-span'],
      beginArea: artistData['begin-area'],
      endArea: artistData['end-area'],
      type: artistData.type,
      country: artistData.country,
      disambiguation: artistData.disambiguation,
      relations: artistData.relations,
      aliases: artistData.aliases,
      genres: artistData.genres,
      membersOfband: membersOfband,
      urls: URLRelations
    }

    successApiCall(req)
    res.json(artist)
  } catch (error) {
    errorApiCall(req, error)
    return res.status(400).json({error : 'Error fetching Artist'})
  }

}

const discography = async (req, res) => {
  const { artistId, type } = req.query
  let page = Number(req.query.page) || 0

  logApiCall(req)

  const limit = 25

  if (!artistId) {
    errorApiCall(req, 'Missing artistId')
    res.status(400).json({error: 'Missing parameters'})
    return
  }

  if (type !== 'album' && type !== 'single' && type !==  'ep') {
    errorApiCall(req, 'Incorrect type')
    res.status(400).json({error: 'Incorrect type'})
    return
  }

  if (page < 1) {
    errorApiCall(req, "Page number doesn't exist.")
    res.status(400).json({error: "Page number doesn't exist."})
    return
  }

  try {

    const releases = await fetch(`http://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=${type}&limit=${limit}&release-group-status=website-default&offset=${(page - 1) * limit}`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 

    if (!releases.ok) {
      errorApiCall(req, `MusicBrainz error: ${releases.status}`)
      return res.status(releases.status).json({error: `MusicBrainz server returned an error. Try again later or check the artist ID.`})
    }

    const releasesData = await releases.json()
    const releaseGroups = releasesData['release-groups']
    const sorted = await Promise.all(
      [...releaseGroups].sort((a, b) => {
        const lenA = a['secondary-types']?.length || 0
        const lenB = b['secondary-types']?.length || 0
        return lenA - lenB
      }).map(async (releaseGroup) => {
        
        let nums
        if (type === 'single') {
          nums = await prisma.userSongReviews.aggregate({
            where: {songId: releaseGroup.id},
            _avg: {rating: true},
            _count: {rating: true}
          })
        } else if (type === 'album' || type === 'ep') {
          nums = await prisma.userReleaseReviews.aggregate({
            where: {releaseId: releaseGroup.id},
            _avg: {rating: true},
            _count: {rating: true}
          })
        }

        
        const average = nums._avg.rating
        const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0
        return {
          type: releaseGroup['secondary-types']?.join(' + ') || releaseGroup['primary-type'] || "Unknown",
          id: releaseGroup.id,
          firstReleaseDate: releaseGroup['first-release-date'] || "",
          disambiguation: releaseGroup.disambiguation || "",
          title: releaseGroup.title,
          averageRating: nums._avg.rating ? avgRounded : null,
          totalReviews: nums._count.rating ?? 0,
        }
      }
    )) 

    const data = {
      data: sorted,
      count: releasesData['release-group-count'],
      currentPage: page,
      pages: Math.ceil(releasesData['release-group-count'] / limit),
      limit: limit
    }

    console.log(sorted)
    res.json(data)

  } catch (error) {
     
    if (error.cause && error.cause.code === 'ECONNRESET') {
      console.error('[NETWORK ERROR] MusicBrainz connection reset:', error);
      errorApiCall(req, error.message)
      return res.status(502).json({ error: 'Upstream MusicBrainz connection reset'})
    }
    
    console.error('[UNEXPECTED ERROR] Failed fetching discography:', error)
    errorApiCall(req, error.message)
    return res.status(500).json({ error: 'Failed to fetch discography data.' })
  }
  
}

const discographySingles = async (req, res) => {
  const { artistId } = req.query
  let page = Number(req.query.page) || 0

  logApiCall(req)

  const limit = 100

  try {
    const releases = await fetch(`https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json&limit=${limit}&offset=${(page - 1) * limit}&inc=release-groups+recordings+recording-level-rels+work-rels+work-level-rels&status=official&type=single`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 
    const data = await releases.json()

    const rgInfo = await fetch(`http://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=single&limit=${limit}&release-group-status=website-default&offset=${(page - 1) * limit}`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 
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
    console.log(response)
    res.json(response)
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

const getRelease = async (req, res) => {
  const { releaseId } = req.query
  
  logApiCall(req)

  try {

    const albums = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${releaseId}&type=album&status=official&inc=recordings+artist-credits+genres+release-groups+recording-level-rels+work-rels+work-level-rels&fmt=json&limit=100&offset=0`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

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

    const FetchCoverArt = await fetch(`https://coverartarchive.org/release-group/${releaseId}`)

    let coverArt = null
    if (FetchCoverArt.ok) {
      const coverArtJSON = await FetchCoverArt.json()
      coverArt = coverArtJSON.images.filter(img => img.front === true)
    }

    successApiCall(req)
    return res.json({
      album: first,
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
    return res.status(500).json({ error: 'Failed to fetch release data.' })
  }
}

const getSong = async (req, res) => {
  const { songId } = req.query

  logApiCall(req)

  if (!songId) {
    errorApiCall(req, 'Missing songId')
    return res.status(400).json({error : 'Missing songId'})
  }

  try {

    const fetchSong = await fetch(`https://musicbrainz.org/ws/2/recording/${songId}?fmt=json&inc=artist-rels+artist-credits+genres+releases+release-groups+work-rels&status=official`, {
      headers: {
        'User-Agent': userAgent
      }
    })

    if (!fetchSong.ok) {
      errorApiCall(req, `MusicBrainz error: ${fetchSong.status}`)
      return res.status(fetchSong.status).json({error: `MusicBrainz server returned an error. Try again later or check the song ID.`})
    }

    const song = await fetchSong.json()

    song.releases.sort((a, b) => {
      const weight = (r) => r['release-group']?.["primary-type"] === 'Single' ? 0 : 1
      return weight(a) - weight(b) 
    })

    console.log(song[0])

    let coverArtUrl = ''
    if (song.releases.length !== 0) {
      const albumId = song.releases[0]['release-group'].id
      const FetchCoverArt = await fetch(`https://coverartarchive.org/release-group/${albumId}`)
      const coverArtJSON = await FetchCoverArt.json()
      const coverArt = coverArtJSON.images.filter(img => img.front === true)
      coverArtUrl = coverArt[0].image
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
    songFormatted = {
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
    console.log(songFormatted)
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

const findSingleId = async (req, res) => {
  const { rgId } = req.query

  logApiCall(req)

  try {
    const fetchSingle = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${rgId}&status=official&type=single&inc=release-groups+recordings&fmt=json`, {
      headers: {
        'User-Agent': userAgent
      }
    })

    if (!fetchSingle.ok) {
      errorApiCall(req, `MusicBrainz error: ${fetchSingle.status}`)
      return res.status(fetchSingle.status).json({error: `MusicBrainz server returned an error. Try again later or check the artist ID.`})
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

module.exports = {
  artists,
  releases,
  getArtist,
  getRelease,
  getSong,
  discography,
  discographySingles,
  findSingleId
}