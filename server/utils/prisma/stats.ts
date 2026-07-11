import prisma from "../../prisma/client"

export const getLandingStats = () =>
  Promise.all([
    prisma.userArtistReviews.groupBy({
      by: ['artistId'],
      where: { status: 'PUBLISHED' },
      _count: { artistId: true },
      orderBy: { _count: { artistId: 'desc' } },
      take: 5
    }),
    prisma.userLikedArtist.groupBy({
      by: ['artistId'],
      _count: { artistId: true },
      orderBy: { _count: { artistId: 'desc' } },
      take: 5
    }),
    prisma.userLikedRelease.groupBy({
      by: ['releaseId'],
      _count: { releaseId: true },
      orderBy: { _count: { releaseId: 'desc' } },
      take: 5
    })
  ])

export const getLandingEntities = (artistIds: string[], releaseIds: string[]) =>
  Promise.all([
    prisma.artist.findMany({ where: { id: { in: artistIds } } }),
    prisma.release.findMany({ where: { id: { in: releaseIds } } })
  ])