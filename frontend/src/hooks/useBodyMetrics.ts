import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listBodyMetrics, 
  getBodyMetric, 
  upsertBodyMetric, 
  updateBodyMetric, 
  deleteBodyMetric 
} from '@/api/bodyMetrics'
import { useAuth } from '@/auth/AuthContext'
import type { BodyMetricCreateSchema } from '@/schemas'
import { z } from 'zod'

export function useBodyMetrics(filters?: { from?: string; to?: string }) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['body-metrics', user?.id, filters],
    queryFn: () => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return listBodyMetrics(user.id, credentials, filters)
    },
    enabled: !!credentials && !!user?.id,
  })
}

export function useBodyMetric(metricId: number) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['body-metrics', user?.id, metricId],
    queryFn: () => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return getBodyMetric(user.id, metricId, credentials)
    },
    enabled: !!credentials && !!user?.id && !!metricId,
  })
}

export function useUpsertBodyMetric() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof BodyMetricCreateSchema>) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return upsertBodyMetric(user.id, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-metrics', user?.id] })
    },
  })
}

export function useUpdateBodyMetric() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ metricId, payload }: { metricId: number; payload: z.infer<typeof BodyMetricCreateSchema> }) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return updateBodyMetric(user.id, metricId, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-metrics', user?.id] })
    },
  })
}

export function useDeleteBodyMetric() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (metricId: number) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return deleteBodyMetric(user.id, metricId, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-metrics', user?.id] })
    },
  })
}
