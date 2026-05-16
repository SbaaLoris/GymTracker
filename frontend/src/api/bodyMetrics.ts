import { z } from 'zod'
import { BodyMetricSchema, BodyMetricCreateSchema } from '@/schemas'
import { apiFetch, type Credentials } from './client'

export function listBodyMetrics(
  userId: number,
  credentials: Credentials,
  filters?: { from?: string; to?: string }
) {
  const params = new URLSearchParams()
  if (filters?.from) params.append('from', filters.from)
  if (filters?.to) params.append('to', filters.to)

  const query = params.toString()
  return apiFetch(`/users/${userId}/body-metrics${query ? `?${query}` : ''}`, z.array(BodyMetricSchema), credentials)
}

export function getBodyMetric(userId: number, metricId: number, credentials: Credentials) {
  return apiFetch(`/users/${userId}/body-metrics/${metricId}`, BodyMetricSchema, credentials)
}

export function upsertBodyMetric(userId: number, payload: z.infer<typeof BodyMetricCreateSchema>, credentials: Credentials) {
  // Backend uses POST for upsert (returns 200 if updated, 201 if created)
  return apiFetch(`/users/${userId}/body-metrics`, BodyMetricSchema, credentials, {
    method: 'POST',
    body: JSON.stringify(BodyMetricCreateSchema.parse(payload)),
  })
}

export function updateBodyMetric(userId: number, metricId: number, payload: z.infer<typeof BodyMetricCreateSchema>, credentials: Credentials) {
  return apiFetch(`/users/${userId}/body-metrics/${metricId}`, BodyMetricSchema, credentials, {
    method: 'PUT',
    body: JSON.stringify(BodyMetricCreateSchema.parse(payload)),
  })
}

export function deleteBodyMetric(userId: number, metricId: number, credentials: Credentials) {
  return apiFetch(`/users/${userId}/body-metrics/${metricId}`, z.undefined(), credentials, {
    method: 'DELETE',
  })
}
