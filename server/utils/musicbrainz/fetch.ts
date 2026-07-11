import { mbQueue } from "./musicbrainzQue"
import { buildCoverArtUrl } from "./buildUrl"

const userAgent = process.env.USER_AGENT!

export const mbFetch = async (url: string) => {
  const response = await mbQueue.add(() => fetch(url, {
    headers: { 'User-Agent': userAgent as string }
  }))
  if (!response.ok) throw { status: response.status }
  return response.json()
} 

export const fetchCoverArt = async (url: string) => {
  const response = await mbQueue.add(() => fetch(url))
  if (!response.ok) return null
  const json = await response.json()
  return json.images.find((img: any) => img.front === true)?.image ?? null
}

export const fetchSongCoverArt = async (releases: any[]) => {
  if (releases.length === 0) return ''
  const albumId = releases[0]['release-group'].id
  return fetchCoverArt(buildCoverArtUrl(albumId))
}