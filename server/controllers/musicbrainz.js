const prisma = require('../prisma/client')
const { logApiCall, errorApiCall, successApiCall, TestApiCall } = require('../utils/logging')

const userAgent = 'MusicMania/0.1.0 (dylan18zuniga@gmail.com)'

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

module.exports = {
  artists,
  recordings,
  releases
}