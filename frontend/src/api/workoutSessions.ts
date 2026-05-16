import { z } from 'zod'
import { WorkoutSessionSchema, WorkoutSessionCreateSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listWorkoutSessions(
  userId: number,
  credentials: Credentials,
  filters?: { from?: string; to?: string }
) {
  const params = new URLSearchParams()
  if (filters?.from) params.append('from', filters.from)
  if (filters?.to) params.append('to', filters.to)

  const query = params.toString()
  return apiFetch(`/users/${userId}/workout-sessions${query ? `?${query}` : ''}`, z.array(WorkoutSessionSchema), credentials)
}

export function getWorkoutSession(userId: number, sessionId: number, credentials: Credentials) {
  return apiFetch(`/users/${userId}/workout-sessions/${sessionId}`, WorkoutSessionSchema, credentials)
}

export function createWorkoutSession(userId: number, payload: z.infer<typeof WorkoutSessionCreateSchema>, credentials: Credentials) {
  return apiFetch(`/users/${userId}/workout-sessions`, WorkoutSessionSchema, credentials, {
    method: 'POST',
    body: JSON.stringify(WorkoutSessionCreateSchema.parse(payload)),
  })
}

export function updateWorkoutSession(userId: number, sessionId: number, payload: z.infer<typeof WorkoutSessionCreateSchema>, credentials: Credentials) {
  return apiFetch(`/users/${userId}/workout-sessions/${sessionId}`, WorkoutSessionSchema, credentials, {
    method: 'PUT',
    body: JSON.stringify(WorkoutSessionCreateSchema.parse(payload)),
  })
}

export function deleteWorkoutSession(userId: number, sessionId: number, credentials: Credentials) {
  return apiFetch(`/users/${userId}/workout-sessions/${sessionId}`, z.undefined(), credentials, {
    method: 'DELETE',
  })
}
