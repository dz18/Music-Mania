import { getReleaseGroupRatings } from "../prisma/ratings"
import { classifyUrl } from "./classifyUrl"

export const formatQueryArtist = (artist: any) => ({
  id: artist.id,
  type: artist.type,
  name: artist.name,
  disambiguation: artist.disambiguation
})

export const formatQueryRelease = (f: any) => ({
  id: f.id,
  type: f.type,
  title: f.title,
  artistCredit: f['artist-credit'].map((ac: any) => ({
    joinphrase: ac.joinphrase,
    name: ac.name
  })),
  primaryType: f['primary-type'],
  firstReleaseDate: f['first-release-date']
})

const VALID_URL_TYPES = new Set([
  'allmusic', 'IMDb', 'myspace', 'official homepage', 'social network',
  'songkick', 'soundcloud', 'streaming', 'video channel', 'wikidata',
  'wikipedia', 'youtube', 'youtube music', 'lyrics', 'image'
])

export const formatMembers = (relations: any[]) => {
  const seen = new Set()
  return relations
    .filter(r => r.type.includes('member'))
    .filter(r => !seen.has(r.artist.id) && seen.add(r.artist.id))
    .map(r => ({
      lifeSpan: { begin: r.begin, end: r.end, ended: r.ended },
      artist: {
        type: r.artist.type,
        id: r.artist.id,
        name: r.artist.name,
        country: r.artist.country,
        disambiguation: r.artist.disambiguation
      }
    }))
}

export const formatUrls = (relations: any[]) => {
  return relations
    .filter(r => VALID_URL_TYPES.has(r.type) && r.url)
    .map(classifyUrl)
    .filter(Boolean)
}

export const formatArtist = (artistData: any) => ({
  id: artistData.id,
  gender: artistData.gender,
  name: artistData.name,
  lifeSpan: artistData['life-span'],
  beginArea: artistData['begin-area'],
  endArea: artistData['end-area'],
  type: artistData.type,
  country: artistData.country,
  disambiguation: artistData.disambiguation,
  aliases: artistData.aliases,
  genres: artistData.genres,
  membersOfband: formatMembers(artistData.relations),
  urls: formatUrls(artistData.relations)
})

export const formatReleaseGroup = async (releaseGroup: any, type: string) => {
  const nums = await getReleaseGroupRatings(releaseGroup.id, type)
  const average = nums._avg.rating
  const avgRounded = average != null ? +average.toFixed(2) : null

  return {
    id: releaseGroup.id,
    type: releaseGroup['secondary-types']?.join(' + ') || releaseGroup['primary-type'] || 'Unknown',
    title: releaseGroup.title,
    firstReleaseDate: releaseGroup['first-release-date'] || '',
    disambiguation: releaseGroup.disambiguation || '',
    averageRating: avgRounded,
    totalReviews: nums._count.rating ?? 0,
  }
}

export const sortAndFormatReleaseGroups = (releaseGroups: any[], type: string) => {
  const sorted = [...releaseGroups].sort((a, b) =>
    (a['secondary-types']?.length || 0) - (b['secondary-types']?.length || 0)
  )
  return Promise.all(sorted.map(rg => formatReleaseGroup(rg, type)))
}