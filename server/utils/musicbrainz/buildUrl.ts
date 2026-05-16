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