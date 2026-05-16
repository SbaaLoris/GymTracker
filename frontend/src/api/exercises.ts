import { z } from 'zod'
import { ExerciseSchema, ExerciseCreateSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listExercises(
  credentials: Credentials,
  filters?: {
    muscle_group?: string
    is_cardio?: boolean
    include_inactive?: boolean
    search?: string
  }
) {
  const params = new URLSearchParams()
  if (filters?.muscle_group) params.append('muscle_group', filters.muscle_group)
  if (filters?.is_cardio !== undefined) params.append('is_cardio', String(filters.is_cardio))
  if (filters?.include_inactive !== undefined) params.append('include_inactive', String(filters.include_inactive))
  if (filters?.search) params.append('search', filters.search)

  const query = params.toString()
  return apiFetch(`/exercises${query ? `?${query}` : ''}`, z.array(ExerciseSchema), credentials)
}

export function getExercise(id: number, credentials: Credentials) {
  return apiFetch(`/exercises/${id}`, ExerciseSchema, credentials)
}

export function createExercise(payload: z.infer<typeof ExerciseCreateSchema>, credentials: Credentials) {
  return apiFetch('/exercises', ExerciseSchema, credentials, {
    method: 'POST',
    body: JSON.stringify(ExerciseCreateSchema.parse(payload)),
  })
}

export function updateExercise(id: number, payload: z.infer<typeof ExerciseCreateSchema>, credentials: Credentials) {
  return apiFetch(`/exercises/${id}`, ExerciseSchema, credentials, {
    method: 'PUT',
    body: JSON.stringify(ExerciseCreateSchema.parse(payload)),
  })
}

export function deleteExercise(id: number, credentials: Credentials) {
  return apiFetch(`/exercises/${id}`, ExerciseSchema, credentials, {
    method: 'DELETE',
  })
}
