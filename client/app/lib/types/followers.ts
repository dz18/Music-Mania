interface FollowersResponse {
  count: number,
  pages: number,
  page: number
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
  total: number,
  isFollowing: Record<string, boolean> // userId => followingStatus
}