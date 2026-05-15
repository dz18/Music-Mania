import z, { string } from "zod";

export const artistsSchema = z.object({
    q: z.string(),
    type: z.enum(['person', 'group', 'character']).optional(),
    page: z.number().positive().default(1),
})

export const releasesSchema = z.object({
    q: z.string(),
    type: z.enum(['Album', 'EP']).optional(),
    page: z.number().positive().default(1),
})

export const getArtistsSchema = z.object({
    id: z.string()
})

export const discographySchema = z.object({
    artistId: z.string(),
    type: z.string(),
    page: z.number().positive().default(0)
})

export const discographySinglesSchema = z.object({
    artistId: z.string(),
    page: z.number().positive().default(0)
})

export const getReleaseSchema = z.object({
    releaseId: z.string()
})

export const getSongSchema = z.object({
    songId: z.string()
})

export const findSingleIdSchema = z.object({
    rgId: z.string()
})