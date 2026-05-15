import { z } from 'zod'

export const StrengthSetSchema = z.object({
  type: z.literal('strength'),
  id: z.number(),
  exercise_id: z.number(),
  reps: z.number(),
  weight: z.number(),
})
export type StrengthSet = z.infer<typeof StrengthSetSchema>

export const CardioSetSchema = z.object({
  type: z.literal('cardio'),
  id: z.number(),
  exercise_id: z.number(),
  duration: z.number(),
})
export type CardioSet = z.infer<typeof CardioSetSchema>

export const WorkoutSetSchema = z.discriminatedUnion('type', [StrengthSetSchema, CardioSetSchema])
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>

export const StrengthSetInputSchema = z.object({
  type: z.literal('strength'),
  exercise_id: z.number(),
  reps: z.number().min(1),
  weight: z.number().min(0),
})
export type StrengthSetInput = z.infer<typeof StrengthSetInputSchema>

export const CardioSetInputSchema = z.object({
  type: z.literal('cardio'),
  exercise_id: z.number(),
  duration: z.number().min(1),
})
export type CardioSetInput = z.infer<typeof CardioSetInputSchema>

export const WorkoutSetInputSchema = z.discriminatedUnion('type', [
  StrengthSetInputSchema,
  CardioSetInputSchema,
])
export type WorkoutSetInput = z.infer<typeof WorkoutSetInputSchema>

export const WorkoutSessionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.iso.date(), // ← v4: z.iso.date() statt z.string().date()
  plan_id: z.number().nullable(),
  sets: z.array(WorkoutSetSchema),
})
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>

export const WorkoutSessionCreateSchema = z.object({
  date: z.iso.date(),
  plan_id: z.number().nullable().optional(),
  sets: z.array(WorkoutSetInputSchema).min(1),
})
export type WorkoutSessionCreate = z.infer<typeof WorkoutSessionCreateSchema>
