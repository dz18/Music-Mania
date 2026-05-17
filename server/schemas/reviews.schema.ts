    import z from "zod";
    import { 
        pageValidation, 
        ratingValidation, 
        starValidation, 
        typeValidation
    } from "./validations";


    export const artistReviewsSchema = z.object({
        id: z.string({error: 'missing artist id'}),
        page: pageValidation,
        star: starValidation
    })

    export const releaseReviewsSchema = z.object({
        id: z.string(),
        page: pageValidation,
        star: starValidation
    })

    export const songReviewsSchema = z.object({
        songId: z.string({error: 'missing parameters'}),
        workId: z.string().optional(),
        page: pageValidation,
        star: starValidation
    })

    export const userReviewSchema = z.object({
        userId: z.string(),
        itemId: z.string(),
        type: typeValidation,
        workId: z.string().optional(),
    })

    export const publishOrDraftSchema = z.object({
        itemId: z.string(),
        title: z.string(),
        rating: ratingValidation,
        review: z.string(),
        type: typeValidation,
        status: z.enum(['DRAFT', 'PUBLISHED'], 'invalid status'),
        itemName: z.string().optional(),
        itemTitle: z.string().optional(),
        artistCredit: z.any().optional(),
        coverArt: z.url().optional(),
        tags: z.any().optional()
    }).superRefine((data, ctx) => {
        if (data.type === 'artist' && !data.itemName) {
            ctx.addIssue({ code: 'custom', message: 'itemName is required for artist', path: ['itemName'] })
        }
        if ((data.type === 'release' || data.type === 'song') && !data.itemTitle) {
            ctx.addIssue({ code: 'custom', message: 'itemTitle is required for release or song', path: ['itemTitle'] })
        }
        if (data.status === 'PUBLISHED' && !data.rating) {
            ctx.addIssue({ code: 'custom', message: 'rating is required for published reviews', path: ['rating'] })
        }
    })

    export const deleteReviewSchema = z.object({
        itemId: z.string(),
        type: typeValidation
    })

    export const userArtistsSchema = z.object({
        profileId: z.string(),
        page: pageValidation,
        star: starValidation
    })

    export const userReleasesSchema = z.object({
    profileId: z.string(),
    page: z.coerce.number().positive().default(1),
    star: z.coerce.number().optional()
    })

    export const userSongsSchema = z.object({
    profileId: z.string(),
    page: z.coerce.number().positive().default(1),
    star: z.coerce.number().optional()
    })