import { z } from 'zod'

export const RoleSchema = z.enum(['admin', 'user'])
export type Role = z.infer<typeof RoleSchema>

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    role: RoleSchema,
})
export type User = z.infer<typeof UserSchema>

export const UserRegistrationSchema = z.object({
    username: z.string(),
    password: z.string(),
})
export type UserRegistration = z.infer<typeof UserRegistrationSchema>