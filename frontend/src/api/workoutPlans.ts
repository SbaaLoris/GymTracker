import { z } from 'zod'
import { WorkoutPlanSchema, WorkoutPlanCreateSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listWorkoutPlans(credentials: Credentials, isTemplate?: boolean) {
  const query = isTemplate !== undefined ? `?is_template=${isTemplate}` : ''
  return apiFetch(`/workout-plans${query}`, z.array(WorkoutPlanSchema), credentials)
}

export function getWorkoutPlan(id: number, credentials: Credentials) {
  return apiFetch(`/workout-plans/${id}`, WorkoutPlanSchema, credentials)
}

export function createWorkoutPlan(payload: z.infer<typeof WorkoutPlanCreateSchema>, credentials: Credentials) {
  return apiFetch('/workout-plans', WorkoutPlanSchema, credentials, {
    method: 'POST',
    body: JSON.stringify(WorkoutPlanCreateSchema.parse(payload)),
  })
}

export function updateWorkoutPlan(id: number, payload: z.infer<typeof WorkoutPlanCreateSchema>, credentials: Credentials) {
  return apiFetch(`/workout-plans/${id}`, WorkoutPlanSchema, credentials, {
    method: 'PUT',
    body: JSON.stringify(WorkoutPlanCreateSchema.parse(payload)),
  })
}

export function deleteWorkoutPlan(id: number, credentials: Credentials) {
  return apiFetch(`/workout-plans/${id}`, z.undefined(), credentials, {
    method: 'DELETE',
  })
}
