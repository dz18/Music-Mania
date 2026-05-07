import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

export type TopArtist = {
  id: string
  name: string
  count: number
}

export type TopRelease = {
  id: string
  title: string
  artistCredit: any[]
  coverArt: string | null
  count: number
}

export type LandingStats = {
  topReviewedArtists: TopArtist[]
  topLikedArtists: TopArtist[]
  topLikedReleases: TopRelease[]
}

export const getLandingStats = async (): Promise<LandingStats> => {
  const { data } = await axios.get<LandingStats>(`${API}/api/stats/landing`)
  return data
}
