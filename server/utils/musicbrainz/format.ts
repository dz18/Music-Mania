import { formatMedia } from "../../controllers/hooks/formatMedia"
import { getReleaseGroupRatings, getSingleRatings } from "../prisma/ratings"
import { classifyUrl } from "./classifyUrl"
import { scoreRelease } from "../../controllers/hooks/scoreRelease"

const FORMAT_PRIORITY = ['CD', 'Digital Media']
const DISAMBIGUATION_PRIORITY = ['clean', '', 'explicit']

const VALID_URL_TYPES = new Set([
  'allmusic', 'IMDb', 'myspace', 'official homepage', 'social network',
  'songkick', 'soundcloud', 'streaming', 'video channel', 'wikidata',
  'wikipedia', 'youtube', 'youtube music', 'lyrics', 'image'
])

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

export const dedupeByReleaseGroup = (releases: any[]) => {
  const seen = new Set()
  return releases.filter(r => {
    const rgid = r['release-group'].id
    if (seen.has(rgid)) return false
    seen.add(rgid)
    return true
  })
}

export const extractWorkIdFromRelease = (release: any): string | null => {
  const firstTrack = release.media?.[0]?.tracks?.[0]?.recording
  if (!firstTrack?.relations) return null
  return firstTrack.relations.find((rel: any) => rel.work?.id)?.work.id ?? null
}

export const formatSingle = (s: any) => ({
  ...s['release-group'],
  workId: extractWorkIdFromRelease(s)
})

export const formatSingleWithRatings = async (rg: any) => {
  const base = {
    type: rg['secondary-types']?.join(' + ') || rg['primary-type'] || 'Unknown',
    id: rg.id,
    workId: rg.workId,
    firstReleaseDate: rg['first-release-date'] || '',
    disambiguation: rg.disambiguation || '',
    title: rg.title,
  }

  if (!rg.workId) return { ...base, averageRating: null, totalReviews: null }

  const nums = await getSingleRatings(rg.workId)
  const average = nums._avg.rating
  const avgRounded = average != null ? +average.toFixed(2) : null

  return {
    ...base,
    averageRating: avgRounded,
    totalReviews: nums._count.rating ?? 0,
  }
}

export const sortAndFormatSingles = (singles: any[]) => {
  const sorted = [...singles]
    .sort((a, b) => (a['secondary-types']?.length || 0) - (b['secondary-types']?.length || 0))
    .map(formatSingle)
  return Promise.all(sorted.map(formatSingleWithRatings))
}

export const sortReleases = (releases: any[]) =>
  [...releases].sort((a, b) => {
    const aFormat = FORMAT_PRIORITY.indexOf(a.media[0]?.format || '')
    const bFormat = FORMAT_PRIORITY.indexOf(b.media[0]?.format || '')
    if (aFormat !== bFormat) return bFormat - aFormat

    const aDate = a.date ? new Date(a.date).getTime() : Infinity
    const bDate = b.date ? new Date(b.date).getTime() : Infinity
    if (aDate !== bDate) return bDate - aDate

    const aDisamb = DISAMBIGUATION_PRIORITY.indexOf(a.disambiguation || '')
    const bDisamb = DISAMBIGUATION_PRIORITY.indexOf(b.disambiguation || '')
    if (aDisamb !== bDisamb) return bDisamb - aDisamb

    return a.disambiguation.length - b.disambiguation.length
  })

export const formatRelease = (album: any) => ({
  releaseId: album.id,
  id: album['release-group'].id,
  title: album['release-group'].title,
  coverArtArchive: album['cover-art-archive'].artwork,
  disambiguation: album.disambiguation,
  date: album['release-group']['first-release-date'],
  media: album.media.map((m: any) => formatMedia(m)),
  trackCount: album.media.reduce((sum: number, m: any) => sum + (m['track-count'] ?? 0), 0),
  artistCredit: album['artist-credit'],
  language: album['text-representation'].language,
  type: album['release-group']['secondary-types'].length !== 0
    ? album['release-group']['secondary-types']
    : [album['release-group']['primary-type']],
  genres: album['release-group']['genres']
})

export const attachTrackRatings = (media: any[], stats: any[][]) =>
  media.map((m, discIndex) => ({
    ...m,
    tracks: m.tracks.map((t: any, trackIndex: number) => {
      const stat = stats[discIndex][trackIndex]
      return {
        ...t,
        recording: {
          ...t.recording,
          totalReviews: stat._count.rating,
          avgRating: stat._count.rating > 0 ? Number(stat._avg.rating).toFixed(2) : null
        }
      }
    })
  }))

export const sortReleasesByType = (releases: any[]) =>
[...releases].sort((a, b) => {
  const weight = (r: any) => r['release-group']?.['primary-type'] === 'Single' ? 0 : 1
  return weight(a) - weight(b)
})

export const extractPartOf = (releases: any[]) => {
  const seen = new Set()
  return releases
    .filter(r => {
      const type = r['release-group']['primary-type']
      if (seen.has(type) || type === 'Single') return false
      seen.add(type)
      return true
    })
    .map(r => ({
      type: r['release-group']['primary-type'],
      id: r['release-group'].id,
      name: r['release-group'].title
    }))
}

export const extractWorkIdFromRecording = (song: any) =>
  song?.relations?.find(
    (rel: any) => rel['target-type'] === 'work' && rel.work?.id
  )?.work?.id ?? song.id

export const formatSong = (song: any) => ({
  id: song.id,
  artistCredit: song['artist-credit'],
  genres: song.genres,
  length: song.length,
  title: song.title,
  firstReleaseDate: song['first-release-date'],
  partOf: extractPartOf(song.releases),
  disambiguation: song.disambiguation,
  video: song.video,
  workId: extractWorkIdFromRecording                                                                                                                                                                                                                                                              (song)
})

export const extractMostOfficialRecording = (releases: any[]) => {
  const mostOfficial = releases
    .filter(r => r.status === 'Official')
    .sort((a, b) => scoreRelease(b) - scoreRelease(a))[0]
  return mostOfficial?.media[0]?.tracks[0]?.recording.id ?? null
}