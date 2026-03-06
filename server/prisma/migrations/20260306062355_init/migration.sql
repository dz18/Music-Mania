-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('ARTIST', 'SONG', 'RELEASE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutMe" TEXT,
    "age" INTEGER,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Release" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistCredit" JSONB NOT NULL,
    "coverArt" TEXT,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistCredit" JSONB NOT NULL,
    "coverArt" TEXT,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLikedArtist" (
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedArtist_pkey" PRIMARY KEY ("userId","artistId")
);

-- CreateTable
CREATE TABLE "public"."UserLikedRelease" (
    "userId" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedRelease_pkey" PRIMARY KEY ("userId","releaseId")
);

-- CreateTable
CREATE TABLE "public"."UserLikedSong" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedSong_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateTable
CREATE TABLE "public"."UserArtistReviews" (
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "UserArtistReviews_pkey" PRIMARY KEY ("userId","artistId")
);

-- CreateTable
CREATE TABLE "public"."UserReleaseReviews" (
    "userId" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "UserReleaseReviews_pkey" PRIMARY KEY ("userId","releaseId")
);

-- CreateTable
CREATE TABLE "public"."UserSongReviews" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "UserSongReviews_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistReviewTag" (
    "reviewUserId" TEXT NOT NULL,
    "reviewArtistId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ArtistReviewTag_pkey" PRIMARY KEY ("reviewUserId","reviewArtistId","tagId")
);

-- CreateTable
CREATE TABLE "public"."ReleaseReviewTag" (
    "reviewUserId" TEXT NOT NULL,
    "reviewReleaseId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ReleaseReviewTag_pkey" PRIMARY KEY ("reviewUserId","reviewReleaseId","tagId")
);

-- CreateTable
CREATE TABLE "public"."SongReviewTag" (
    "reviewUserId" TEXT NOT NULL,
    "reviewSongId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "SongReviewTag_pkey" PRIMARY KEY ("reviewUserId","reviewSongId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "public"."Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "public"."Tag"("slug");

-- CreateIndex
CREATE INDEX "ArtistReviewTag_tagId_idx" ON "public"."ArtistReviewTag"("tagId");

-- CreateIndex
CREATE INDEX "ReleaseReviewTag_tagId_idx" ON "public"."ReleaseReviewTag"("tagId");

-- CreateIndex
CREATE INDEX "SongReviewTag_tagId_idx" ON "public"."SongReviewTag"("tagId");

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedRelease" ADD CONSTRAINT "UserLikedRelease_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedRelease" ADD CONSTRAINT "UserLikedRelease_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "public"."Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedSong" ADD CONSTRAINT "UserLikedSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedSong" ADD CONSTRAINT "UserLikedSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserArtistReviews" ADD CONSTRAINT "UserArtistReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserArtistReviews" ADD CONSTRAINT "UserArtistReviews_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserReleaseReviews" ADD CONSTRAINT "UserReleaseReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserReleaseReviews" ADD CONSTRAINT "UserReleaseReviews_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "public"."Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSongReviews" ADD CONSTRAINT "UserSongReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSongReviews" ADD CONSTRAINT "UserSongReviews_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistReviewTag" ADD CONSTRAINT "ArtistReviewTag_reviewUserId_reviewArtistId_fkey" FOREIGN KEY ("reviewUserId", "reviewArtistId") REFERENCES "public"."UserArtistReviews"("userId", "artistId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistReviewTag" ADD CONSTRAINT "ArtistReviewTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReleaseReviewTag" ADD CONSTRAINT "ReleaseReviewTag_reviewUserId_reviewReleaseId_fkey" FOREIGN KEY ("reviewUserId", "reviewReleaseId") REFERENCES "public"."UserReleaseReviews"("userId", "releaseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReleaseReviewTag" ADD CONSTRAINT "ReleaseReviewTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongReviewTag" ADD CONSTRAINT "SongReviewTag_reviewUserId_reviewSongId_fkey" FOREIGN KEY ("reviewUserId", "reviewSongId") REFERENCES "public"."UserSongReviews"("userId", "songId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongReviewTag" ADD CONSTRAINT "SongReviewTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
