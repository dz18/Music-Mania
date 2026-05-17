import prisma from "../../prisma/client"

export const getSingleRatings = async (workId: string) => {
  return prisma.userSongReviews.aggregate({
    where: { songId: workId },
    _avg: { rating: true },
    _count: { rating: true }
  })
}

export const getReleaseRatings = async (releaseId: string) => {
  return prisma.userReleaseReviews.aggregate({
    where: { releaseId },
    _avg: { rating: true },
    _count: { rating: true }
  })
}

export const getReleaseGroupRatings = async (id: string, type: string) => {
  if (type === 'single') return getSingleRatings(id)
  return getReleaseRatings(id)
}

export const getTrackRatings = async (workId: string) => 
  prisma.userSongReviews.aggregate({
    where: { songId: workId },
    _count: { rating: true },
    _avg: { rating: true }
  })


export const getMediaRatings = (media: any[]) => 
  Promise.all(
    media.map(m =>
      Promise.all(m.tracks.map((t: any) => getTrackRatings(t.recording.workId)))
    )
  )
