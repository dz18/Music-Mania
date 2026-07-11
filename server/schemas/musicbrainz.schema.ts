import z, { string } from "zod";
import { pageValidation } from "./validations";

export const artistsSchema = z.object({
    q: z.string({ error: 'missing query' }),
    type: z.enum(['person', 'group', 'character']).optional(),
    page: pageValidation,
})

export const releasesSchema = z.object({
    q: z.string({ error: 'missing query' }),
    type: z.enum(['Album', 'EP']).optional(),
    page: pageValidation,
})

export const getArtistsSchema = z.object({
    id: z.string({ error: 'Missing query' })
})

export const discographySchema = z.object({
    artistId: z.string({ error: 'Missing artistId' }),
    type: z.enum(['album', 'single', 'ep'], { error: 'Incorrect type' }),
    page: pageValidation
})

export const discographySinglesSchema = z.object({
    artistId: z.string(),
    page: pageValidation
})

export const getReleaseSchema = z.object({
    releaseId: z.string()
})

export const getSongSchema = z.object({
    songId: z.string({ error: 'Missing songId' })
})

export const findSingleIdSchema = z.object({
    rgId: z.string()
})