import { formatArtistCredit } from "./formatArtistCredit.js";

function findWorkId (relation, fallback) {
  if (!relation) return
  const workRel = relation.find(rel => rel.work?.id)
  if (workRel) return workRel.work.id;
  else return fallback
}

export function formatTrack (track) {

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