import z from 'zod';
import prisma from '../prisma/client';
import { logApiCall, errorApiCall, successApiCall } from '../utils/logging/logging';
import { getSignedURL, deleteObject, SignedUrlResult, DeleteResult } from './AWS/actions';
import { calcStarStats } from './hooks/calcStarStats';

import { Request, Response } from 'express';
import { allFollowersSchema, checkLikeSchema, deleteLikeSchema, editSchema, followSchema, isFollowingSchema, likeSchema, likesSchema, profileSchema, querySchema, reviewPanelSchema, unfollowSchema } from '../schemas/user.schema';
import { checkUsernameDuplicate, createFollow, deleteFollow, getFollows, getFollowStatus, getIsFollowingMap, getLikeCounts, getLikedByType, getProfileReviewStats, getReviewPanel, getUserById, getUserEditInfo, getUserProfile, searchUsers, updateUser } from '../utils/prisma/users';
import { checkLikeStatus, createLike, deleteLikeByType } from '../utils/prisma/likes';

// Gets all users
const getUserCount = async (req: Request, res: Response) => {
  logApiCall(req)
  try {
    const count = await prisma.user.count()
    successApiCall(req)
    return res.json(count)
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to count users.' })
  }
}

// Find a user
const findUserById = async (req: Request, res: Response) => {

  try {
    
    logApiCall(req)

    const user = await getUserById(req.user!.id)

    if (!user) {
      errorApiCall(req, 'User does not exist')
      return res.status(404).json({error: 'User does not exist.'})
    }

    successApiCall(req)
    return res.json({
      username: user.username,
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
    })
  } catch (error) {
    errorApiCall(req, error)
    return res.status(500).json({error: 'Finding user failed.'})
  }
}

const getLikes = async (req: Request, res: Response) => {
  logApiCall(req)
  const { id, active } = req.validatedQuery as z.infer<typeof likesSchema>

  try {
    const [countArtists, countReleases, countSongs] = await getLikeCounts(id)
    const liked: any = {
      _count: {
        userLikedArtist: countArtists,
        userLikedRelease: countReleases,
        userLikedSong: countSongs,
      }
    }

    if (active) liked[`userLiked${active.charAt(0).toUpperCase() + active.slice(1)}`] = await getLikedByType(id, active)

    successApiCall(req)
    return res.json(liked)
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch likes.' })
  }
}

const query = async (req: Request, res: Response) => {
  logApiCall(req)
  const { q, page } = req.validatedQuery as z.infer<typeof querySchema>
  const limit = 50

  try {
    const [users, count] = await searchUsers(q, page, limit)

    successApiCall(req)
    return res.json({
      data: { suggestions: users },
      count: count._count,
      limit,
      pages: Math.ceil(count._count / limit),
      currentPage: page
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to query users.' })
  }
}

const profile = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId } = req.validatedQuery as z.infer<typeof profileSchema>

  try {
    const [userProfile, [artistStats, releaseStats, songStats], followStatus] = await Promise.all([
      getUserProfile(profileId),
      getProfileReviewStats(profileId),
      req.user ? getFollowStatus(req.user.id, profileId) : Promise.resolve(null)
    ])

    if (!userProfile) {
      errorApiCall(req, 'User not found')
      return res.status(404).json({ error: 'User not found.' })
    }

    const isFollowing = req.user ? Boolean(followStatus) : null
    const starStats = calcStarStats([...artistStats, ...releaseStats, ...songStats])
    const totalReviewCount = userProfile._count.artistReviews + userProfile._count.releaseReviews + userProfile._count.songReviews
    const { _count, ...rest } = userProfile

    successApiCall(req)
    return res.json({
      ...rest,
      ...userProfile._count,
      totalReviewCount,
      starStats,
      isFollowing,
      followingSince: req.user && isFollowing ? followStatus?.createdAt : null
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch profile.' })
  }
}

const isFollowing = async (req: Request, res: Response) => {
  logApiCall(req)
  const { userId, profileId } = req.validatedQuery as z.infer<typeof isFollowingSchema>

  try {
    const follow = await getFollowStatus(userId, profileId)
    successApiCall(req)
    return res.json(follow)
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch follow status.' })
  }
}

const follow = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId } = req.validatedBody as z.infer<typeof followSchema>

  try {
    const follow = await createFollow(req.user!.id, profileId)
    successApiCall(req)
    return res.json(follow)
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to follow user.' })
  }
}

const unfollow = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId } = req.validatedBody as z.infer<typeof unfollowSchema>

  try {
    await deleteFollow(req.user!.id, profileId)
    successApiCall(req)
    return res.json({ success: true })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to unfollow user.' })
  }
}

const allFollowers = async (req: Request, res: Response) => {
  logApiCall(req)
  const { profileId, page, userId, following } = req.validatedQuery as z.infer<typeof allFollowersSchema>
  const limit = 25

  try {
    const profile = await prisma.user.findUnique({
      where: { id: profileId },
      select: { username: true }
    })
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    const [total, follows] = await getFollows(profileId, following, page, limit)
    const targetIds = follows
      .map((f: any) => following ? f.followingId : f.followerId)
      .filter((id: string) => id !== userId)

    const isFollowingMap = await getIsFollowingMap(userId, targetIds)

    successApiCall(req)
    return res.json({
      data: { isFollowingMap, follows, username: profile.username },
      pages: Math.ceil(total / limit),
      limit,
      currentPage: page,
      count: total
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch followers.' })
  }
}

const editInfo = async (req: Request, res: Response) => {
  logApiCall(req)
  try {
    const user = await getUserEditInfo(req.user!.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    successApiCall(req)
    return res.json({
      avatar: '',
      id: user.id,
      username: user.username,
      aboutMe: user.aboutMe ?? '',
      createdAt: user.createdAt,
      email: user.email,
      age: user.age ?? '',
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch user info.' })
  }
}

const edit = async (req: Request, res: Response) => {
  logApiCall(req)
  const id = req.user!.id
  const avatar = req.file
  const { username, aboutMe, age, resetAvatar, updatedAt } = req.validatedBody as z.infer<typeof editSchema>

  const errors: Record<string, string> = {}

  try {
    const [usernameDuplicate, avatarResult] = await Promise.all([
      checkUsernameDuplicate(username, id),
      avatar
        ? getSignedURL(`avatars/${id}`, avatar.mimetype, avatar.size)
        : resetAvatar
          ? deleteObject(`avatars/${id}`)
          : Promise.resolve(null)
    ])

    if (usernameDuplicate) errors.username = 'Username is already taken'

    let url = null
    if (avatar) {
      const result = avatarResult as SignedUrlResult
      if (result.error) errors.avatar = result.error
      else url = result.success!.url
    } else if (resetAvatar) {
      const result = avatarResult as DeleteResult
      if (result.error) errors.avatar = result.error
    }

    if (Object.keys(errors).length > 0) return res.status(409).json({ errors })

    const data = await updateUser(id, { username, aboutMe, age, updatedAt: updatedAt ? new Date(updatedAt) : undefined  })

    successApiCall(req)
    return res.status(200).json({
      message: 'Profile Updated Successfully',
      data: { ...data, age: String(data.age), avatar: '' },
      url
    })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to update profile.' })
  }
}

const reviewPanel = async (req: Request, res: Response) => {
  logApiCall(req)
  const { itemId, type } = req.validatedQuery as z.infer<typeof reviewPanelSchema>

  try {
    const review = await getReviewPanel(type, req.user!.id, itemId)

    if (!review) return res.json(null)

    const tags = (review as any).tags?.map((t: any) => t.tag.name) ?? []
    
    successApiCall(req)
    return res.json({ ...review, tags })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to fetch review panel.' })
  }
}

const checkLike = async (req: Request, res: Response) => {
  logApiCall(req)
  const { itemId, type } = req.validatedQuery as z.infer<typeof checkLikeSchema>

  try {
    const like = await checkLikeStatus(type, req.user!.id, itemId)
    successApiCall(req)
    return res.json({ liked: Boolean(like) })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to check like status.' })
  }
}

const like = async (req: Request, res: Response) => {
  logApiCall(req)
  const { itemId, type, name, title, artistCredit, coverArt } = req.validatedBody as z.infer<typeof likeSchema>
  const userId = req.user!.id

  if (!['artist', 'release', 'song'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' })
  }

  try {
    const newLike = await createLike(type, userId, itemId, { name, title, artistCredit, coverArt })
    successApiCall(req)
    return res.json({ success: true, like: newLike })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to like item.' })
  }
}

const deleteLike = async (req: Request, res: Response) => {
  logApiCall(req)
  const { itemId, type } = req.validatedBody as z.infer<typeof deleteLikeSchema>

  if (!['artist', 'release', 'song'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' })
  }

  try {
    await deleteLikeByType(type, req.user!.id, itemId)
    successApiCall(req)
    return res.json({ success: true })
  } catch (error: any) {
    errorApiCall(req, error)
    return res.status(500).json({ error: 'Failed to delete like.' })
  }
}

export default {
  getUserCount,
  query,
  getLikes,
  profile,
  allFollowers,
  isFollowing,
  findUserById,
  editInfo,
  reviewPanel,
  follow,
  like,
  unfollow,
  deleteLike,
  edit,
  checkLike
};