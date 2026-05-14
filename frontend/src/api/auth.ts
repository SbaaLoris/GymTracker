import { apiFetch, type Credentials } from './client'
import {
  UserRegistrationSchema,
  UserSchema,
  type User,
  type UserRegistration,
} from '@/schemas/user'

export function getMe(credentials: Credentials): Promise<User> {
  return apiFetch('/auth/me', UserSchema, credentials)
}

export function registerUser(payload: UserRegistration): Promise<User> {
  return apiFetch('/auth/register', UserSchema, null, {
    method: 'POST',
    body: JSON.stringify(UserRegistrationSchema.parse(payload)),
  })
}
