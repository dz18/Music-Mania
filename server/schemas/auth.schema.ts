import z from "zod";

export const signInSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const registerSchema = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string()
})

export const confirmPasswordSchema = z.object({
    email: z.email(),
    password: z.string(),
})

export const changePasswordSchema = z.object({
    email: z.email(),
    password: z.string(),
    newPassword: z.string(),
}).refine(data => data.password !== data.newPassword, {
    error: 'New Password must be different from current Password',
    path: ['newPassword']
})