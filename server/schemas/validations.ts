import z from "zod"

export const starValidation = z.enum(['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']).transform(Number).optional()
export const ratingValidation = z.enum(['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']).transform(Number)
export const pageValidation = z.number().positive().default(1)
export const typeValidation = z.enum(['artist', 'release', 'song'])
export const activeValidation = z.enum(['artists', 'releases', 'songs'])
