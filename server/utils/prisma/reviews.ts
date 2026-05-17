import { tagConnectOrCreate } from "../../controllers/hooks/tagConnectOrCreate";
import { Status } from "../../generated/prisma";
import prisma from "../../prisma/client";

export const getArtistReviews = (id: string, page: number, star: number | undefined, limit: number) =>
  prisma.userArtistReviews.findMany({
    where: { artistId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
    include: { user: { omit: { password: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  })

export const getArtistReviewStats = (id: string, star: number | undefined) =>
  Promise.all([
    prisma.userArtistReviews.aggregate({
      where: { artistId: id, status: 'PUBLISHED' },
      _avg: { rating: true }
    }),
    prisma.userArtistReviews.aggregate({
      where: { artistId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
      _count: true
    }),
    prisma.userArtistReviews.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { artistId: id, status: 'PUBLISHED' }
    })
  ])

export const getReleaseReviews = (id: string, page: number, star: number | undefined, limit: number) =>
  prisma.userReleaseReviews.findMany({
    where: { releaseId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
    include: { user: { omit: { password: true } } },
    orderBy: { createdAt: 'asc' },
    skip: (page - 1) * limit,
    take: limit
  })

export const getReleaseReviewStats = (id: string, star: number | undefined) =>
  Promise.all([
    prisma.userReleaseReviews.aggregate({
      where: { releaseId: id, status: 'PUBLISHED' },
      _avg: { rating: true }
    }),
    prisma.userReleaseReviews.aggregate({
      where: { releaseId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
      _count: true
    }),
    prisma.userReleaseReviews.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { releaseId: id, status: 'PUBLISHED' }
    })
  ])

export const getSongReviews = (id: string, page: number, star: number | undefined, limit: number) =>
  prisma.userSongReviews.findMany({
    where: { songId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
    include: { user: { omit: { password: true } } },
    orderBy: { createdAt: 'asc' },
    skip: (page - 1) * limit,
    take: limit
  })

export const getSongReviewStats = (id: string, star: number | undefined) =>
  Promise.all([
    prisma.userSongReviews.aggregate({
      where: { songId: id, status: 'PUBLISHED' },
      _avg: { rating: true }
    }),
    prisma.userSongReviews.aggregate({
      where: { songId: id, status: 'PUBLISHED', ...(star ? { rating: star } : {}) },
      _count: true
    }),
    prisma.userSongReviews.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { songId: id, status: 'PUBLISHED' }
    })
  ])

export const getUserReview = (userId: string, itemId: string, type: string, workId?: string) => {
  if (type === 'artist') {
    return prisma.userArtistReviews.findUnique({
      where: { userId_artistId: { userId, artistId: itemId } }
    })
  }
  if (type === 'release') {
    return prisma.userReleaseReviews.findUnique({
      where: { userId_releaseId: { userId, releaseId: itemId } }
    })
  }
  if (type === 'song') {
    return prisma.userSongReviews.findUnique({
      where: { userId_songId: { userId, songId: workId ?? itemId } }
    })
  }
  return null
}

export const upsertArtistReview = async (userId: string, itemId: string, itemName: string, createData: any, updateData: any, tags: any[]) => {
  await prisma.artist.upsert({
    where: { id: itemId },
    update: {},
    create: { id: itemId, name: itemName }
  })
  return prisma.userArtistReviews.upsert({
    where: { userId_artistId: { userId, artistId: itemId } },
    update: { ...updateData, tags: { deleteMany: {}, create: tagConnectOrCreate(tags) } },
    create: { ...createData, artistId: itemId, tags: { create: tagConnectOrCreate(tags) } },
    include: { user: { omit: { password: true } } }
  })
}

export const upsertItemReview = async (
  type: 'release' | 'song',
  userId: string,
  itemId: string,
  itemTitle: string,
  artistCredit: any,
  coverArt: string,
  createData: any,
  updateData: any
) => {
  const itemData = { id: itemId, title: itemTitle, artistCredit, coverArt }

  if (type === 'release') {
    await prisma.release.upsert({ where: { id: itemId }, update: {}, create: itemData })
    return prisma.userReleaseReviews.upsert({
      where: { userId_releaseId: { userId, releaseId: itemId } },
      update: updateData,
      create: { ...createData, releaseId: itemId },
      include: { user: { omit: { password: true } } }
    })
  }

  await prisma.song.upsert({ where: { id: itemId }, update: {}, create: itemData })
  return prisma.userSongReviews.upsert({
    where: { userId_songId: { userId, songId: itemId } },
    update: updateData,
    create: { ...createData, songId: itemId },
    include: { user: { omit: { password: true } } }
  })
}

export const getReviewStats = (type: string, itemId: string) => {
  if (type === 'artist') {
    return Promise.all([
      prisma.userArtistReviews.aggregate({
        where: { artistId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true }, _count: true
      }),
      prisma.userArtistReviews.groupBy({
        by: ['rating'], _count: { rating: true },
        where: { artistId: itemId, status: 'PUBLISHED' }
      })
    ])
  }
  if (type === 'release') {
    return Promise.all([
      prisma.userReleaseReviews.aggregate({
        where: { releaseId: itemId, status: 'PUBLISHED' },
        _avg: { rating: true }, _count: true
      }),
      prisma.userReleaseReviews.groupBy({
        by: ['rating'], _count: { rating: true },
        where: { releaseId: itemId, status: 'PUBLISHED' }
      })
    ])
  }
  return Promise.all([
    prisma.userSongReviews.aggregate({
      where: { songId: itemId, status: 'PUBLISHED' },
      _avg: { rating: true }, _count: true
    }),
    prisma.userSongReviews.groupBy({
      by: ['rating'], _count: { rating: true },
      where: { songId: itemId, status: 'PUBLISHED' }
    })
  ])
}

export const deleteReviewByType = (type: string, userId: string, itemId: string) => {
  if (type === 'artist') {
    return prisma.userArtistReviews.delete({
      where: { userId_artistId: { userId, artistId: itemId } }
    })
  }
  if (type === 'release') {
    return prisma.userReleaseReviews.delete({
      where: { userId_releaseId: { userId, releaseId: itemId } }
    })
  }
  return prisma.userSongReviews.delete({
    where: { userId_songId: { userId, songId: itemId } }
  })
}

export const getUserArtistReviews = (profileId: string, page: number, star: number | undefined, limit: number) =>
  Promise.all([
    prisma.userArtistReviews.findMany({
      where: { userId: profileId, status: 'PUBLISHED', ...(star && { rating: star }) },
      include: { artist: true },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.userArtistReviews.aggregate({
      where: { userId: profileId, status: 'PUBLISHED', ...(star && { rating: star }) },
      _count: true
    }),
    prisma.userArtistReviews.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { userId: profileId, status: 'PUBLISHED' }
    })
  ])

export const getUserReleaseReviews = (userId: string, page: number, star: number | undefined, limit: number) =>
  Promise.all([
    prisma.userReleaseReviews.findMany({
      where: { userId, status: 'PUBLISHED', ...(star && { rating: star }) },
      include: { release: true },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.userReleaseReviews.aggregate({
      where: { userId, status: 'PUBLISHED', ...(star && { rating: star }) },
      _count: true
    }),
    prisma.userReleaseReviews.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { userId, status: 'PUBLISHED' }
    })
  ])

export const getUserReviewsByType = (type: 'artist' | 'release' | 'song', userId: string, page: number, star: number | undefined, limit: number) => {
  const where = { userId, status: 'PUBLISHED' as Status, ...(star && { rating: star }) }
  const whereNoStar = { userId, status: 'PUBLISHED' as Status }

  if (type === 'artist') {
    return Promise.all([
      prisma.userArtistReviews.findMany({ where, include: { artist: true }, take: limit, skip: (page - 1) * limit, orderBy: { createdAt: 'desc' } }),
      prisma.userArtistReviews.aggregate({ where, _count: true }),
      prisma.userArtistReviews.groupBy({ by: ['rating'], _count: { rating: true }, where: whereNoStar })
    ])
  }
  if (type === 'release') {
    return Promise.all([
      prisma.userReleaseReviews.findMany({ where, include: { release: true }, take: limit, skip: (page - 1) * limit, orderBy: { createdAt: 'desc' } }),
      prisma.userReleaseReviews.aggregate({ where, _count: true }),
      prisma.userReleaseReviews.groupBy({ by: ['rating'], _count: { rating: true }, where: whereNoStar })
    ])
  }
  return Promise.all([
    prisma.userSongReviews.findMany({ where, include: { song: true }, take: limit, skip: (page - 1) * limit, orderBy: { createdAt: 'desc' } }),
    prisma.userSongReviews.aggregate({ where, _count: true }),
    prisma.userSongReviews.groupBy({ by: ['rating'], _count: { rating: true }, where: whereNoStar })
  ])
}