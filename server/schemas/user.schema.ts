import { z } from 'zod'
import { 
  activeValidation, 
  pageValidation, 
  typeValidation
} from './validations'

export const likesSchema = z.object({
  id: z.string(),
  active: activeValidation
})

export const querySchema = z.object({
  q: z.string(),
  page: pageValidation,
})

export const profileSchema = z.object({
  profileId: z.string()
})

export const isFollowingSchema = z.object({
  userId: z.string(),
  profileId: z.string()
})

export const followSchema = z.object({
  profileId: z.string()
})

export const unfollowSchema = z.object({
  profileId: z.string()
})

export const allFollowersSchema = z.object({
  profileId: z.string(),
  page: pageValidation,
  userId: z.string(),
  following: z.boolean(),
})

export const editSchema = z.object({
  username: z.string(),
  aboutMe: z.string().optional(),
  age: z.preprocess(v => v === '' || v === undefined ? null : Number(v), z.number().min(13).max(120).nullable()),
  resetAvatar: z.preprocess(v => v === 'true', z.boolean()),
  updatedAt: z.string().optional()
})

export const reviewPanelSchema = z.object({
  itemId: z.string(),
  type: typeValidation
})

export const checkLikeSchema = z.object({
  itemId: z.string(),
  type: typeValidation
})

export const likeSchema = z.object({
  itemId: z.string(),
  type: typeValidation,
  name: z.string().optional(),
  title: z.string().optional(),
  artistCredit: z.any().optional(),
  coverArt: z.url().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'artist' && !data.name) {
    ctx.addIssue({ code: 'custom', message: 'name is required for artist', path: ['name'] })
  }
  if ((data.type === 'release' || data.type === 'song') && !data.title) {
    ctx.addIssue({ code: 'custom', message: 'title is required for release or song', path: ['title'] })
  }
})

export const deleteLikeSchema = z.object({
  itemId: z.string(),
  type: typeValidation
})