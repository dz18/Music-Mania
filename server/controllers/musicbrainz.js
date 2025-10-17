const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall } = require('../utils/logging')

const userAgent = 'MusicMania/0.1.0 (dylan18zuniga@gmail.com)'

// Search Bar Functions

const artists = async (req, res) => {
  const { q } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!q) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameter')
    return res.status(400).json({error : 'Error fetching suggested artist'})
  }

  try {
    const query = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${q}&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })
    const data = await query.json()

    // Sort & Filter
    const artists = []
    for (const artist of data.artists) {
      // console.log(artist)
      const filtered = {
        id : artist.id,
        type : artist.type,
        name : artist.name,
        disambiguation : artist.disambiguation
      }
      artists.push(filtered)
    }
    console.log('results ========')

    successApiCall(req.method, req.originalUrl)
    return res.json(artists)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested artist'})
  }
}

const releases = async (req, res) => {
  const { q } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!q) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  try {

    const query = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=${q} AND (primarytype:album OR primarytype:ep)&inc=artist-credits&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })


    if (!query.ok) {
      errorApiCall(req.method, req.originalUrl, 'Query Failed')
      return res.status(500).json({error : 'Error'})
    }

    const data = await query.json()


    console.log(data['release-groups'][0] ?? [])
    successApiCall(req.method, req.originalUrl)
    return res.json(data['release-groups'])

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested releases'})
  }

}

// Retrieve Item Functions
const getArtist = async (req, res) => {
  const { id } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!id) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameter')
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

    const artistData = await fetchArtist.json()

    if (!artistData) {
      errorApiCall(req.method, req.originalUrl, 'Musicbrainz API failed')
    }

    const membersOfband = []
    const URLRelations = []
    const membersSet = new Set()
    for(const relation of artistData.relations) {
      if(relation.type.includes('member')) {
        // console.log(relation)
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
        // console.log(relation.url.resource)
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

    // console.log(artist)
    successApiCall(req.method, req.originalUrl)
    res.json(artist)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested releases'})
  }

}

const discography = async (req, res) => {
  const { artistId, type } = req.query
  let offset = Number(req.query.offset) || 0

  logApiCall(req.method, req.originalUrl)
  console.log('Fetching artists discography...')

  if (!artistId) {
    errorApiCall(req.method, req.originalUrl, 'Missing artistId')
    res.status(400).json({error: 'Missing parameters'})
    return
  }

  if (type !== 'album' && type !== 'single' && type !==  'ep') {
    errorApiCall(req.method, req.originalUrl, 'Incorrect type')
    res.status(400).json({error: 'Incorrect type'})
    return
  }

  try {
    
    const start = new Date()

    const releases = await fetch(`http://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=${type}&limit=25&release-group-status=website-default&offset=${offset}`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 

    const releasesData = await releases.json()
    
    const releaseGroups = releasesData['release-groups']
    const sorted = await Promise.all(
      [...releaseGroups].sort((a, b) => {
        const lenA = a['secondary-types']?.length || 0
        const lenB = b['secondary-types']?.length || 0
        return lenA - lenB
      }).map(async (releaseGroup) => {
        
        const nums = await prisma.review.aggregate({
          where: {itemId: releaseGroup.id},
          _avg: {rating: true},
          _count: {rating: true}
        })

        
        const average = nums._avg.rating
        const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0
        return {
          type: releaseGroup['secondary-types']?.join(' + ') || releaseGroup['primary-type'] || "Unknown",
          id: releaseGroup.id,
          firstReleaseDate: releaseGroup['first-release-date'] || "",
          disambiguation: releaseGroup.disambiguation || "",
          title: releaseGroup.title,
          averageRating: avgRounded ?? 0,
          totalReviews: nums._count.rating ?? 0,
        }
      }
    )) 
    // !! Debug !!
    // const seen = new Set()
    // let i = 1
    // sorted.forEach(releaseGroup => {
    //   const key = releaseGroup['secondary-types'].join(' + ') // empty string if no types

    //   if (!seen.has(key)) {
    //     console.log(key || `${type}s`) // handle empty array
    //     i = 1
    //     seen.add(key)
    //   }

    //   console.log(`${i}. ${releaseGroup.title}`)
    //   i += 1
    // })

    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Count:', releasesData['release-group-count'])
    console.log('Total:', releasesData['release-groups'].length)
    console.log('Time:', duration, 'seconds')

    res.json({
      data: sorted, 
      count: releasesData['release-group-count']
    })

  } catch (error) {
    console.error(error)
  }
}

const getAlbum = async (req, res) => {
  const { albumId } = req.query
  
  logApiCall(req.method, req.originalUrl)

  try {
    const albums = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${albumId}&type=album&status=official&inc=recordings+artist-credits+genres+release-groups&fmt=json&limit=100&offset=0`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const albumsJSON = await albums.json()
    const albumData = albumsJSON.releases

    const formatPriority = ["CD", "Digital Media"]
    const disambiguationPriority = ["clean", "explicit", ""]
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
      const media = album.media[0]

      return {
        releaseId: album.id,
        id: album['release-group'].id,
        title: album['release-group'].title,
        coverArtArchive: album['cover-art-archive'].artwork,
        disambiguation: album.disambiguation,
        date: album['release-group']['first-release-date'],
        tracks: media.tracks,
        format: media.format,
        trackCount: media['track-count'],
        artistCredit: album['artist-credit'],
        language: album['text-representation'].language,
        type: album['release-group']['secondary-types'].length !== 0 ? album['release-group']['secondary-types'] : [album['release-group']['primary-type']],
        genres: album['release-group']['genres']
      }
    })

    const first = sorted[0]
    
    const FetchCoverArt = await fetch(`https://coverartarchive.org/release-group/${albumId}`)
    const coverArtJSON = await FetchCoverArt.json()
    const coverArt = coverArtJSON.images.filter(img => img.front === true)

    //console.log(sorted)
    successApiCall(req.method, req.originalUrl)
    return res.json({
      album: first,
      coverArtUrl: coverArt[0].image
    })

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const getSong = async (req, res) => {
  const { songId } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!songId) {
    errorApiCall(req.method, req.originalUrl, 'Missing songId')
    return res.status(400).json({error : 'Missing songId'})
  }

  try {

    const fetchSong = await fetch(`https://musicbrainz.org/ws/2/recording/${songId}?fmt=json&inc=artist-rels+artist-credits+genres+releases+release-groups`, {
      headers: {
        'User-Agent': userAgent
      }
    })

    const song = await fetchSong.json()
    // console.log(song)

    song.releases.sort((a, b) => {
      const weight = (r) => r['release-group']?.["primary-type"] === 'Single' ? 0 : 1
      return weight(a) - weight(b) 
    })

    // console.log(song.releases.length)
    // console.log(song.releases.map(r => r['release-group']['primary-type']))

    let coverArtUrl = ''
    if (song.releases.length !== 0) {
      const albumId = song.releases[0]['release-group'].id
      const FetchCoverArt = await fetch(`https://coverartarchive.org/release-group/${albumId}`)
      const coverArtJSON = await FetchCoverArt.json()
      const coverArt = coverArtJSON.images.filter(img => img.front === true)
      coverArtUrl = coverArt[0].image
    }

    console.log(coverArtUrl)
    successApiCall(req.method, req.originalUrl)
    return res.json({
      song, 
      coverArtUrl
    })
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

const findSingleId = async (req, res) => {
  const { rgId } = req.query

  logApiCall(req.method, req.originalUrl)

  try {
    const fetchSingle = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${rgId}&status=official&type=single&inc=release-groups+recordings&fmt=json`, {
      headers: {
        'User-Agent': userAgent
      } 
    })

    const single = await fetchSingle.json()

    if (single['release-count'] === 0) {
      res.status(404).json({error : 'No Recordings found'})
    }
    // console.log(single)
   
    const media = single.releases.map(r => r.media)
    const recording = media.map(m => m[0].tracks[0].recording)

    recording.sort((a, b) => (
      a.disambiguation.length - b.disambiguation.length
    ))


    successApiCall(req.method, req.originalUrl)
    return res.json(recording[0].id)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
  }
}

module.exports = {
  artists,
  releases,
  getArtist,
  discography,
  getAlbum,
  getSong,
  findSingleId
}