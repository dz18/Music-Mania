interface UserArtistReview {
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

interface UserReleaseReview {
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

interface UserSongReview {
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

interface ReviewModalErrors {
    title: string,
    rating: string,
    reviewText: string,
    tag: string,
    tags: string
  }