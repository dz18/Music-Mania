const { formatArtistCredit } = require('./formatArtistCredit')

function findWorkId (relation, fallback) {
  if (!relation) return
  const workRel = relation.find(rel => rel.work?.id)
  if (workRel) return workRel.work.id;
  else return fallback
}

function formatTrack (track) {

  const workId = findWorkId(track.recording.relations, track.recording.id)

  return {
    length: track.length,
    id: track.id,
    artistCredit: track['artist-credit'].map(ac => formatArtistCredit(ac)),
    position: track.position,
    title: track.title,
    recording: {
      id: track.recording.id,
      workId: workId,
      length: track.recording.length,
      artistCredit: track.recording['artist-credit'],
    }
  }
}

function formatMedia(media) {
  return {
    position: media.position,
    title: media.title,
    trackCount: media['track-count'],
    tracks: media.tracks.map(t => formatTrack(t))
  }
}

module.exports = { formatMedia }
