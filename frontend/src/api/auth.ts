import { apiFetch, type Credentials } from './client'
import { UserSchema, type User } from '@/schemas/user'

export function getMe(credentials: Credentials): Promise<User> {
    return apiFetch('/auth/me', UserSchema, credentials)
}