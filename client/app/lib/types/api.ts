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