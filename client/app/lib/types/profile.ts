interface UserProfile {
  id: string
  username: string
  createdAt: Date
  updatedAt: Date
  avatar: string
  aboutMe: string
  role: string
  favArtists: {
    userId: string
    artistId: string
    since: Date
    artist: {
      id: string
      name: string
    }
  }[]
  favReleases: {
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
    }
  }[]
  favSongs: {
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
    }
  }[]
  artistReviews: {
    userId: string
    artistId: string
    rating: number
    title: string
    review: string
    createdAt: string
    updatedAt: string
    status: 'PUBLISHED' | 'DRAFT'
    artist: {
      id: string
      name: string
    }
  }[]
  releaseReviews: {
    userId: string
    releaseId: string
    rating: number
    title: string
    review: string
    createdAt: string
    updatedAt: string
    status: 'PUBLISHED' | 'DRAFT'
    release: {
      id: string
      title: string
      artistCredit: {
        name: string
        joinphrase: string
      }[]
    }
  }[]
  songReviews: {
    userId: string
    songId: string
    rating: number
    title: string
    review: string
    createdAt: string
    updatedAt: string
    status: 'PUBLISHED' | 'DRAFT'
    song: {
      id: string
      title: string
      artistCredit: {
        name: string
        joinphrase: string
      }[]
    }
  }[]
  totalReviewCount: number
  starStats: [
    StarCount,
    StarCount,
    StarCount,
    StarCount,
    StarCount,
  ]
}