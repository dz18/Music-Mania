import { Review } from "./artist"

export type ReviewResponse = {
  reviews: Review[]
  avgRating: number
}

export type FavoritesResponse = {
  favArtists: string[],
  favRecordings: string[],
  favReleases: string[]
}

export type ReleaseGroup = {
  type: string,
  id: string,
  firstReleaseDate: string,
  disambiguation: string,
  title: string,
  averageRating: number,
  totalReviews: number
}

export interface Release {
  
}

export interface Track {
  length: number,
  numbers: string,
  position: number,
  "artist-credit": ArtistCredit[],
  title: string
  recording: Recording,
  id: string
}

export interface ArtistCredit {
  name: string
  artist: {
    id: string
    name: string
    sortName: string
    disambiguation?: string
  }
  joinphrase?: string
}

export interface Recording {
  id: string
  title: string
  length?: number
  disambiguation?: string
  video: boolean
  "artist-credit": ArtistCredit[]
  "first-release-date"?: string
}