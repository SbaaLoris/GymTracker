import { z } from 'zod'

export const BodyMetricSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.iso.date(),
  body_weight: z.number(),
})
export type BodyMetric = z.infer<typeof BodyMetricSchema>

export const BodyMetricCreateSchema = z.object({
  date: z.iso.date(),
  body_weight: z.number().gt(0),
})
export type BodyMetricCreate = z.infer<typeof BodyMetricCreateSchema>
