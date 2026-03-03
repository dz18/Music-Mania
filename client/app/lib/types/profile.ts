import { ApiPageResponse } from "./api"
import { UserArtistReview, UserReleaseReview, UserSongReview } from "./reviews"

export interface LikedArtist {
  userId: string
  artistId: string
  since: Date
  artist: {
    id: string
    name: string
  }
}

export interface LikedRelease {
  userId: string
  releaseId: string
  since: Date
  release: {
    id: string
    title: string
    artistCredit: {
      name: string
      joinphrase: string
    }[]
    coverArt: string
  }
}

export interface LikedSong {
  userId: string
  songId: string
  since: Date
  song: {
    id: string
    title: string
    artistCredit: {
      name: string
      joinphrase: string
    }[]
    coverArt: string
  }
}

export interface ProfileArtistReview {
  reviews: UserArtistReview[]
  starStats: StarCount[]
}

export interface ProfileReleaseReview {
  reviews: UserReleaseReview[]
  starStats: StarCount[]
}

export interface ProfileSongReview {
  reviews: UserSongReview[]
  starStats: StarCount[]
}

export interface UserProfile {
  id: string
  username: string
  createdAt: Date
  updatedAt: Date
  avatar: string
  aboutMe: string
  role: string
  followers: number
  following: number
  isFollowing: boolean
  followingSince: Date | null
  totalReviewCount: number
  artistReviews: number,
  releaseReviews: number,
  songReviews: number
  LikedArtists: LikedArtist[]
  LikedReleases: LikedRelease[]
  LikedSongs: LikedSong[]
  // favArtists: {
  //   data: FavArtist[]
  //   currentPage: number
  //   pages: number
  //   count: number
  //   limit: number
  // }
  // favReleases: {
  //   data: FavRelease[]
  //   currentPage: number
  //   pages: number
  //   count: number
  //   limit: number
  // }
  // favSongs: {
  //   data: FavSong[]
  //   currentPage: number
  //   pages: number
  //   count: number
  //   limit: number
  // }
  starStats: StarCount[]
}

export type TabKeys = "artistReviews" | "releaseReviews" | "songReviews" | "starStats";

export type TabDataMap = {
  artistReviews: ApiPageResponse<ProfileArtistReview>;
  releaseReviews: ApiPageResponse<ProfileReleaseReview>;
  songReviews: ApiPageResponse<ProfileSongReview>;
  starStats: null
};