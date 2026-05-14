import { z } from 'zod'

export const PlanExerciseSchema = z.object({
  id: z.number(),
  exercise_id: z.number(),
  order_index: z.number(),
  target_sets: z.number(),
  target_reps: z.number(),
  target_weight: z.number().nullable(),
})
export type PlanExercise = z.infer<typeof PlanExerciseSchema>

export const PlanExerciseInputSchema = z.object({
  exercise_id: z.number(),
  order_index: z.number().min(1),
  target_sets: z.number().min(1),
  target_reps: z.number().min(1),
  target_weight: z.number().min(0).nullable().optional(),
})
export type PlanExerciseInput = z.infer<typeof PlanExerciseInputSchema>

export const WorkoutPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  creator_id: z.number(),
  is_template: z.boolean(),
  exercises: z.array(PlanExerciseSchema),
})
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>

export const WorkoutPlanCreateSchema = z.object({
  name: z.string(),
  is_template: z.boolean().optional(),
  exercises: z.array(PlanExerciseInputSchema).min(1),
})
export type WorkoutPlanCreate = z.infer<typeof WorkoutPlanCreateSchema>
