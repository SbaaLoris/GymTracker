import { z } from 'zod'
import { ExerciseRequestSchema, ExerciseRequestCreateSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listExerciseRequests(credentials: Credentials, status?: string) {
  const query = status ? `?status=${status}` : ''
  return apiFetch(`/exercise-requests${query}`, z.array(ExerciseRequestSchema), credentials)
}

export function createExerciseRequest(payload: z.infer<typeof ExerciseRequestCreateSchema>, credentials: Credentials) {
  return apiFetch('/exercise-requests', ExerciseRequestSchema, credentials, {
    method: 'POST',
    body: JSON.stringify(ExerciseRequestCreateSchema.parse(payload)),
  })
}

export function getExerciseRequest(id: number, credentials: Credentials) {
  return apiFetch(`/exercise-requests/${id}`, ExerciseRequestSchema, credentials)
}

export function deleteExerciseRequest(id: number, credentials: Credentials) {
  return apiFetch(`/exercise-requests/${id}`, z.undefined(), credentials, {
    method: 'DELETE',
  })
}

export function approveExerciseRequest(id: number, credentials: Credentials) {
  return apiFetch(`/exercise-requests/${id}/approve`, ExerciseRequestSchema, credentials, {
    method: 'POST',
  })
}

export function denyExerciseRequest(id: number, credentials: Credentials) {
  return apiFetch(`/exercise-requests/${id}/deny`, ExerciseRequestSchema, credentials, {
    method: 'POST',
  })
}
