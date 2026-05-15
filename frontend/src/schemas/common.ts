import { z } from 'zod'

/**
 * Standard error response from the backend.
 */
export const AppErrorSchema = z.object({
  detail: z.string(),
})
export type AppError = z.infer<typeof AppErrorSchema>

/**
 * Detailed validation error from FastAPI.
 * 'loc' represents the path to the field (e.g., ['body', 'username'] or ['body', 'sets', 0, 'reps'])
 */
export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
})
export type ValidationError = z.infer<typeof ValidationErrorSchema>

/**
 * Full 422 Unprocessable Entity response.
 */
export const ValidationErrorResponseSchema = z.object({
  detail: z.array(ValidationErrorSchema),
})
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>
