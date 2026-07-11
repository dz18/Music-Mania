import prisma from "../../prisma/client"

export const checkLikeStatus = (type: string, userId: string, itemId: string) => {
  if (type === 'artist') {
    return prisma.userLikedArtist.findUnique({
      where: { userId_artistId: { userId, artistId: itemId } }
    })
  }
  if (type === 'release') {
    return prisma.userLikedRelease.findFirst({ where: { userId, releaseId: itemId } })
  }
  return prisma.userLikedSong.findFirst({ where: { userId, songId: itemId } })
}

export const createLike = async (type: string, userId: string, itemId: string, meta: {
  name?: string,
  title?: string,
  artistCredit?: any,
  coverArt?: string
}) => {
  if (type === 'artist') {
    await prisma.artist.upsert({
      where: { id: itemId },
      update: {},
      create: { id: itemId, name: meta.name! }
    })
    return prisma.userLikedArtist.create({ data: { userId, artistId: itemId } })
  }
  if (type === 'release') {
    await prisma.release.upsert({
      where: { id: itemId },
      update: {},
      create: { id: itemId, title: meta.title!, artistCredit: meta.artistCredit, coverArt: meta.coverArt }
    })
    return prisma.userLikedRelease.create({ data: { userId, releaseId: itemId } })
  }
  await prisma.song.upsert({
    where: { id: itemId },
    update: {},
    create: { id: itemId, title: meta.title!, artistCredit: meta.artistCredit, coverArt: meta.coverArt }
  })
  return prisma.userLikedSong.create({ data: { userId, songId: itemId } })
}

// utils/prisma/likes.ts
export const deleteLikeByType = (type: string, userId: string, itemId: string) => {
  if (type === 'artist') {
    return prisma.userLikedArtist.deleteMany({ where: { userId, artistId: itemId } })
  }
  if (type === 'release') {
    return prisma.userLikedRelease.deleteMany({ where: { userId, releaseId: itemId } })
  }
  return prisma.userLikedSong.deleteMany({ where: { userId, songId: itemId } })
}