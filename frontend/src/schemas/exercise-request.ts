import { z } from 'zod'
import { MuscleGroupSchema } from './exercise'

export const RequestStatusSchema = z.enum(['pending', 'approved', 'denied'])
export type RequestStatus = z.infer<typeof RequestStatusSchema>

export const ExerciseRequestSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  suggested_name: z.string(),
  muscle_group: MuscleGroupSchema,
  is_cardio: z.boolean(),
  status: RequestStatusSchema,
})
export type ExerciseRequest = z.infer<typeof ExerciseRequestSchema>

export const ExerciseRequestCreateSchema = z.object({
  suggested_name: z.string(),
  muscle_group: MuscleGroupSchema,
  is_cardio: z.boolean(),
})
export type ExerciseRequestCreate = z.infer<typeof ExerciseRequestCreateSchema>
