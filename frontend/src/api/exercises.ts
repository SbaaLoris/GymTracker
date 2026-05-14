import { z } from 'zod'
import { ExerciseSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listExercises(credentials: Credentials) {
    return apiFetch('/exercises', z.array(ExerciseSchema), credentials)
}