import { ZodError } from "zod"

/**
 * Formats a ZodError into a human-readable string.
 * It maps complex paths to friendly names (e.g., exercises.0.target_sets -> Exercise 1: Target Sets).
 */
export function formatZodError(error: ZodError): string {
  if (!error.issues || error.issues.length === 0) {
    return "Validation failed"
  }

  // Get the first issue for the toast (usually enough for UX)
  const issue = error.issues[0]
  const path = issue.path

  if (path.length === 0) {
    return issue.message
  }

  let fieldName = String(path[0])

  // Handle nested array paths like `exercises.0.target_sets`
  if (path[0] === "exercises" && path.length >= 3) {
    const index = Number(path[1])
    const property = String(path[2])
    
    const propName = property
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return `Exercise ${index + 1}: ${propName} ${issue.message}`
  }

  // Capitalize basic fields
  fieldName = fieldName
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return `${fieldName}: ${issue.message}`
}

/**
 * Extracts a safe, human-readable error message from an unknown error object 
 * (like those from Axios or TanStack Query).
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}
