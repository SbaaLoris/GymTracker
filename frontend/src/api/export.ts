import { apiDownload, type Credentials } from './client'

export function exportWorkouts(
  userId: number,
  format: 'csv' | 'pdf',
  credentials: Credentials,
  filters?: { from?: string; to?: string }
) {
  const params = new URLSearchParams()
  params.append('format', format)
  if (filters?.from) params.append('from', filters.from)
  if (filters?.to) params.append('to', filters.to)

  const query = params.toString()
  const filename = `workout_sessions_${userId}.${format}`
  return apiDownload(`/users/${userId}/export/workout-sessions?${query}`, filename, credentials)
}

export function exportBodyMetrics(
  userId: number,
  format: 'csv' | 'pdf',
  credentials: Credentials,
  filters?: { from?: string; to?: string }
) {
  const params = new URLSearchParams()
  params.append('format', format)
  if (filters?.from) params.append('from', filters.from)
  if (filters?.to) params.append('to', filters.to)

  const query = params.toString()
  const filename = `body_metrics_${userId}.${format}`
  return apiDownload(`/users/${userId}/export/body-metrics?${query}`, filename, credentials)
}
