import { z } from 'zod'

export const MuscleGroupSchema = z.enum([
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
])
export type MuscleGroup = z.infer<typeof MuscleGroupSchema>

export const ExerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
  muscle_group: MuscleGroupSchema,
  is_cardio: z.boolean(),
  is_active: z.boolean(),
})
export type Exercise = z.infer<typeof ExerciseSchema>

export const ExerciseCreateSchema = z.object({
  name: z.string(),
  muscle_group: MuscleGroupSchema,
  is_cardio: z.boolean(),
})
export type ExerciseCreate = z.infer<typeof ExerciseCreateSchema>
