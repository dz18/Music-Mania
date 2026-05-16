import prisma from "../../prisma/client"

export const getReleaseGroupRatings = async (id: string, type: string) => {
  if (type === 'single') {
    return prisma.userSongReviews.aggregate({
      where: { songId: id },
      _avg: { rating: true },
      _count: { rating: true }
    })
  }
  return prisma.userReleaseReviews.aggregate({
    where: { releaseId: id },
    _avg: { rating: true },
    _count: { rating: true }
  })
}