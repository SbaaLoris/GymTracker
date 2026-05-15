import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:\n', z.prettifyError(parsed.error))
  throw new Error(
    'Environment validation failed. Please check your .env.local file and ensure all required variables are set correctly.'
  )
}

export const env = parsed.data
