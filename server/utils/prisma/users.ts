import prisma from "../../prisma/client";

export const getUserById = (id: string) => prisma.user.findUnique({
  where: { id: id },
  select: { id: true, username: true, email: true, createdAt: true }
})

export const getLikeCounts = (userId: string) =>
  Promise.all([
    prisma.userLikedArtist.count({ where: { userId } }),
    prisma.userLikedRelease.count({ where: { userId } }),
    prisma.userLikedSong.count({ where: { userId } }),
  ])

export const getLikedByType = (userId: string, active: string) => {
  if (active === 'artists') {
    return prisma.userLikedArtist.findMany({ where: { userId }, include: { artist: true } })
  }
  if (active === 'releases') {
    return prisma.userLikedRelease.findMany({ where: { userId }, include: { release: true } })
  }
  if (active === 'songs') {
    return prisma.userLikedSong.findMany({ where: { userId }, include: { song: true } })
  }
  return null
}

export const searchUsers = (q: string, page: number, limit: number) => {
  const where = { username: { contains: q, mode: 'insensitive' as const } }
  return Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, username: true, createdAt: true },
      take: limit,
      skip: (page - 1) * limit
    }),
    prisma.user.aggregate({ where, _count: true })
  ])
}

// utils/prisma/users.ts
export const getUserProfile = (profileId: string) =>
  prisma.user.findUnique({
    where: { id: profileId },
    include: {
      likedArtists: { include: { artist: true } },
      likedReleases: { include: { release: true } },
      likedSongs: { include: { song: true } },
      _count: {
        select: {
          artistReviews: { where: { status: 'PUBLISHED' } },
          releaseReviews: { where: { status: 'PUBLISHED' } },
          songReviews: { where: { status: 'PUBLISHED' } },
          followers: true,
          following: true
        }
      }
    },
    omit: { password: true, email: true }
  })

export const getProfileReviewStats = (profileId: string) =>
  Promise.all([
    prisma.userArtistReviews.groupBy({
      by: ['rating'], _count: { rating: true },
      where: { userId: profileId, status: 'PUBLISHED' }
    }),
    prisma.userReleaseReviews.groupBy({
      by: ['rating'], _count: { rating: true },
      where: { userId: profileId, status: 'PUBLISHED' }
    }),
    prisma.userSongReviews.groupBy({
      by: ['rating'], _count: { rating: true },
      where: { userId: profileId, status: 'PUBLISHED' }
    })
  ])

export const getFollowStatus = (followerId: string, followingId: string) =>
  prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  })

export const createFollow = (followerId: string, followingId: string) =>
  prisma.follow.create({
    data: { followerId, followingId }
  })

export const deleteFollow = (followerId: string, followingId: string) =>
  prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } }
  })

// utils/prisma/users.ts
export const getFollows = (profileId: string, following: boolean, page: number, limit: number) => {
  const where = following ? { followerId: profileId } : { followingId: profileId }
  const include = following
    ? { following: { omit: { password: true, email: true, aboutMe: true } } }
    : { follower: { omit: { password: true, email: true, aboutMe: true } } }

  return Promise.all([
    prisma.follow.count({ where }),
    prisma.follow.findMany({
      where,
      include,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ])
}

export const getIsFollowingMap = async (userId: string, targetIds: string[]) => {
  if (!userId || targetIds.length === 0) return {}
  const follows = await prisma.follow.findMany({
    where: { followerId: userId, followingId: { in: targetIds } },
    select: { followingId: true }
  })
  const followSet = new Set(follows.map(f => f.followingId))
  return Object.fromEntries(targetIds.map(id => [id, followSet.has(id)]))
}

export const getUserEditInfo = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, aboutMe: true, age: true, email: true, createdAt: true }
  })

export const checkUsernameDuplicate = (username: string, excludeId: string) =>
  prisma.user.findFirst({
    where: { username, NOT: { id: excludeId } }
  })

export const updateUser = (
  id: string, 
  data: { 
    username: string, 
    aboutMe?: string, 
    age?: number | null, 
    updatedAt?: Date 
  }) =>
  prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, aboutMe: true, createdAt: true, email: true, age: true }
  })

export const getReviewPanel = (type: string, userId: string, itemId: string) => {
  if (type === 'artist') {
    return prisma.userArtistReviews.findUnique({
      where: { userId_artistId: { userId, artistId: itemId } },
      include: { tags: { include: { tag: true } } }
    })
  }
  if (type === 'release') {
    return prisma.userReleaseReviews.findUnique({
      where: { userId_releaseId: { userId, releaseId: itemId } }
    })
  }
  return prisma.userSongReviews.findUnique({
    where: { userId_songId: { userId, songId: itemId } }
  })
}