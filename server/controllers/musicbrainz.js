const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall, TestApiCall } = require('../utils/logging')

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
      console.log(artist)
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

const recordings = async (req, res) => {
  const { q } = req.query

  logApiCall(req.method, req.originalUrl)

  if (!q) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameters')
    return res.status(400).json({error : 'Missing query parameters'})
  }

  try {
    const query = await fetch(`https://musicbrainz.org/ws/2/recording/?query=${q}&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })
    const data = await query.json()

    // Sort & Filter
    const recordings = []
    for (const recording of data.recordings) {
      const filtered = {
        id : recording.id,
        title : recording.title,
        length : recording['length'] || null,
        artistCredit: recording["artist-credit"],
        firstReleaseDate: recording["first-release-date"] || null,
        disambiguation : recording.disambiguation || null
      }
      recordings.push(filtered)
    }
    console.log('Total Results:', recordings.length)
    successApiCall(req.method, req.originalUrl)
    return res.json(recordings)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested artists'})
  }

}

const releases = async (req, res) => {
  const { q } = req.query

  TestApiCall(req.method, req.originalUrl)

  if (!q) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  try {
    const query = await fetch(`https://musicbrainz.org/ws/2/release/?query=${q}&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    if (!query.ok) {
      errorApiCall(req.method, req.originalUrl, 'Query Failed')
      return res.status(500).json({error : 'Error'})
    }

    const data = await query.json()

    console.log('Total Results:', data.releases.length)

    // Sort & Filter
    const releases = []
    const exists = new Set()
    for (const release of data.releases) {
      const releaseGroup = release['release-group']
      if (exists.has(releaseGroup.id) || releaseGroup['primary-type'] === 'Single') continue

      console.log(release)

      exists.add(releaseGroup.id)
      const filtered = {
        id : release.id,
        title: release.title,
        artistCredit: release['artist-credit'],
        type : releaseGroup['primary-type'],
        date : release.date
      }
      releases.push(filtered)
    }
    successApiCall(req.method, req.originalUrl)
    return res.json(releases)

  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested releases'})
  }

}

// Retrieve Item Functions

const getArtist = async (req, res) => {
  const { id } = req.query

  TestApiCall(req.method, req.originalUrl)

  if (!id) {
    errorApiCall(req.method, req.originalUrl, 'Missing query parameter')
    return res.status(400).json({error : 'Missing query parameter'})
  }

  try {

    // const fetchArtist = await fetch(`https://musicbrainz.org/ws/2/artist/${id}?inc=url-rels&fmt=json`, {
    //   headers: {
    //     'User-Agent' : userAgent
    //   }
    // })

    const fetchArtist = await fetch(`https://musicbrainz.org/ws/2/artist/${id}?inc=aliases+genres+artist-rels&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const fetchDiscography = await fetch(`https://musicbrainz.org/ws/2/release-group?artist=${id}&fmt=json&limit=100`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const artistData = await fetchArtist.json()
    const discographyData = await fetchDiscography.json()

    const membersOfband = []
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
      } 
    }

    const discography = {
      singles: [],
      albums: [],
      ep: []
    }
    const discogDupes = new Set()
    for (const release of discographyData['release-groups']) {
      if (discogDupes.has(release.id)) continue

      const obj = {
        type: release['primary-type'],
        id: release.id,
        releaseDate: release['first-release-date'],
        disambiguation: release.disambiguation,
        title: release.title,
      }
      if (obj.type === 'Single') {
        discography.singles.push(obj)
      } else if (obj.type === 'Album') {
        discography.albums.push(obj)
      } else if (obj.type === 'EP') {
        discography.ep.push(obj)
      }

      discogDupes.add(release.id)
    }

    const sorted = discography.albums.sort((a, b) => {
      const parseDate = (d) => {
        if (!d) return new Date(0); // fallback for missing date
        const parts = d.split("-");
        const year = parseInt(parts[0]);
        const month = parts[1] ? parseInt(parts[1]) - 1 : 0; // 0-indexed
        const day = parts[2] ? parseInt(parts[2]) : 1;
        return new Date(year, month, day);
      };

      return parseDate(a.date).getTime() - parseDate(b.date).getTime(); // ascending
    });


    console.log(sorted)

    const artist = {
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
      discography : discography
    }

    // console.log(data)
    successApiCall(req.method, req.originalUrl)
    res.json(artist)
  } catch (error) {
    errorApiCall(req.method, req.originalUrl, error)
    return res.status(400).json({error : 'Error fetching suggested releases'})
  }

  
}

module.exports = {
  artists,
  recordings,
  releases,
  getArtist
}