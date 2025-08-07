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

    console.log('Total Results:', data.artists.length)
    successApiCall(req.method, req.originalUrl)
    return res.json(data.artists)

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

    console.log('Total Results:', data.recordings.length)
    successApiCall(req.method, req.originalUrl)
    return res.json(data.recordings)

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
    successApiCall(req.method, req.originalUrl)
    return res.json(data.releases)

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