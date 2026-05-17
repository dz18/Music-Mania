export const buildArtistQueryUrl = (q: string, type: string | undefined, page: number, limit: number) => {
  const typeFilter = type ? ` AND (type:${type})` : ''
  const offset = (page - 1) * limit
  return `https://musicbrainz.org/ws/2/artist/?query=${q}${typeFilter}&fmt=json&limit=${limit}&offset=${offset}`
}

export const buildReleaseQueryUrl = (q: string, type: string | undefined, page: number, limit: number) => {
  const typeFilter = type ? `(primarytype:${type})` : '(primarytype:album OR primarytype:ep)'
  const offset = (page - 1) * limit
  return `https://musicbrainz.org/ws/2/release-group/?query=${q} AND ${typeFilter}&inc=artist-credits&fmt=json&limit=${limit}&offset=${offset}`
}

export const buildArtistUrl = (id: string) => {
  return `https://musicbrainz.org/ws/2/artist/${id}?inc=aliases+genres+artist-rels+url-rels&fmt=json`
}

export const buildDiscographyUrl = (artistId: string, type: string, page: number, limit: number) => {
  const offset = (page - 1) * limit
  return `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=${type}&limit=${limit}&release-group-status=website-default&offset=${offset}`
}

export const buildSinglesUrl = (artistId: string, page: number, limit: number) =>
  `https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json&limit=${limit}&offset=${(page - 1) * limit}&inc=release-groups+recordings+recording-level-rels+work-rels+work-level-rels&status=official&type=single`

export const buildSinglesRgUrl = (artistId: string, page: number, limit: number) =>
  `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=single&limit=${limit}&release-group-status=website-default&offset=${(page - 1) * limit}`

export const buildReleaseUrl = (releaseId: string) =>
  `https://musicbrainz.org/ws/2/release?release-group=${releaseId}&type=album&status=official&inc=recordings+artist-credits+genres+release-groups+recording-level-rels+work-rels+work-level-rels&fmt=json&limit=100&offset=0`

export const buildCoverArtUrl = (releaseId: string) =>
  `https://coverartarchive.org/release-group/${releaseId}`

export const buildSongUrl = (songId: string) =>
  `https://musicbrainz.org/ws/2/recording/${songId}?fmt=json&inc=artist-rels+artist-credits+genres+releases+release-groups+work-rels&status=official`

export const buildFindSingleUrl = (rgId: string) =>
  `https://musicbrainz.org/ws/2/release?release-group=${rgId}&status=official&type=single&inc=release-groups+recordings&fmt=json`