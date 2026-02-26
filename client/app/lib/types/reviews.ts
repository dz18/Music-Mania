import { ArtistCredit } from "./api"

export type ReviewKind = "artist" | "release" | "song"

export interface UserArtistReview {
  userId: string
  artistId: string
  user: User
  artist: {
    id: string,
    name: string
  }
  rating: number
  title?: string
  review?: string
  createdAt: Date
  updatedAt: Date
  status: 'DRAFT' | 'PUBLISHED'
  tags?: string[]
}

export interface UserReleaseReview {
  userId: string
  releaseId: string
  user: User
  release: {
    id: string
    title: string
    artistCredit: {
        joinphrase: string,
        name: string
    }[]
    type: string
    coverArt: string
  }
  rating: number
  title?: string
  review?: string
  createdAt: Date
  updatedAt: Date
  status: 'DRAFT' | 'PUBLISHED'
  tags?: string[]
}

export interface UserSongReview {
  userId: string
  songId: string
  user: User
  song: {
    id: string
    title: string
    artistCredit: {
      joinphrase: string,
      name: string
    }[],
    coverArt: string
  }
  rating: number
  title?: string
  review?: string
  createdAt: Date
  updatedAt: Date
  status: 'DRAFT' | 'PUBLISHED'
  tags?: string[]
}

export interface ReviewModalErrors {
    title: string,
    rating: string,
    reviewText: string,
    tag: string,
    tags: string
}

export interface SaveReviewInput {
  itemId: string
  type: "artist" | "release" | "song"
  title: string
  rating: number
  review: string
  status: "PUBLISHED" | "DRAFT"
  itemName?: string | null
  itemTitle?: string | null
  artistCredit?: ArtistCredit[] | null
  coverArt?: string
  tags: string[]
}

export type ReviewTypeMap = {
  artist: UserArtistReview
  release: UserReleaseReview
  song: UserSongReview
}
export type ReviewByType<T extends ReviewKind> = ReviewTypeMap[T]