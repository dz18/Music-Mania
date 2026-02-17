import { Artist } from "./artist"
import { DiscographyResponse } from "./discography"
import { Song } from "./song"

export type ReviewResponse = {
  reviews: UserArtistReview[] | UserReleaseReview[] | UserSongReview[]
  avgRating: number
  starStats: StarCount[]
}

export type MusicTypes = Artist | Release | Song

export interface ReleaseGroup {
  avgRating: null
  type: string,
  id: string,
  firstReleaseDate: string,
  disambiguation: string,
  title: string,
  averageRating: number,
  totalReviews: number
  workId?: string
}

export interface Media {
  tracks: Track[]
  title: string,
  trackCount: number
  position: number
}

export interface Release {
  releaseId: string
  id: string
  title: string
  coverArtArchive: Object
  disambiguation: string
  date: string
  media: Media[]
  trackCount: number
  artistCredit: ArtistCredit[]
  language: string
  type: string[]
  genres: {
    id: string
    name: string
    disambiguation: string
  }[]
}


export interface Track {
  length: number,
  numbers: string,
  position: number,
  artistCredit: ArtistCredit[],
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
  length: number
  disambiguation?: string
  video: boolean
  artistCredit: ArtistCredit[]
  "first-release-date"?: string
  workId?: string,
  totalReviews?: number
  avgRating?: number
}

export interface FollowersResponse {
  isFollowingMap: Record<string, boolean>
  follows: {
    createdAt: Date
    follower: {
      age: number
      avatar: string
      createdAt: Date,
      id: string
      role: string
      updatedAt: string
      username: string
    },
    following: {
      age: number
      avatar: string
      createdAt: Date,
      id: string
      role: string
      updatedAt: string
      username: string
    }
    followerId: string
    followingId: string
    id: string
  }[]
  username: string
}

export interface ReviewRatingsResponse {
  reviews: UserArtistReview[] | UserReleaseReview[] | UserSongReview[]
}

export type ReviewsTypes = UserArtistReview[] | UserReleaseReview[] | UserSongReview[]
export type ReviewTypes = UserArtistReview | UserReleaseReview | UserSongReview

export type SearchTypes = "artists" | "releases" | "users"

export type ApiData = ReleaseGroup[] | ReviewResponse | FollowersResponse | Suggestion | ReviewRatingsResponse

export interface ApiPageResponse<T> {
  data: T
  count: number
  pages: number
  currentPage: number
  limit: number
}
