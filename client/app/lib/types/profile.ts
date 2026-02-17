interface LikedArtist {
  userId: string
  artistId: string
  since: Date
  artist: {
    id: string
    name: string
  }
}

interface LikedRelease {
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

interface LikedSong {
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

interface ProfileArtistReview {
  reviews: UserArtistReview[]
  starStats: StarCount[]
}

interface ProfileReleaseReview {
  reviews: UserReleaseReview[]
  starStats: StarCount[]
}

interface ProfileSongReview {
  reviews: UserSongReview[]
  starStats: StarCount[]
}

interface UserProfile {
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