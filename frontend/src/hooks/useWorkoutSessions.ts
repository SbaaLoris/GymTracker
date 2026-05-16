import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listWorkoutSessions, 
  getWorkoutSession, 
  createWorkoutSession, 
  updateWorkoutSession, 
  deleteWorkoutSession 
} from '@/api/workoutSessions'
import { useAuth } from '@/auth/AuthContext'
import type { WorkoutSessionCreateSchema } from '@/schemas'
import { z } from 'zod'

export function useWorkoutSessions(filters?: { from?: string; to?: string }) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['workout-sessions', user?.id, filters],
    queryFn: () => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return listWorkoutSessions(user.id, credentials, filters)
    },
    enabled: !!credentials && !!user?.id,
  })
}

export function useWorkoutSession(sessionId: number) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['workout-sessions', user?.id, sessionId],
    queryFn: () => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return getWorkoutSession(user.id, sessionId, credentials)
    },
    enabled: !!credentials && !!user?.id && !!sessionId,
  })
}

export function useCreateWorkoutSession() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof WorkoutSessionCreateSchema>) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return createWorkoutSession(user.id, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions', user?.id] })
    },
  })
}

export function useUpdateWorkoutSession() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: number; payload: z.infer<typeof WorkoutSessionCreateSchema> }) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return updateWorkoutSession(user.id, sessionId, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions', user?.id] })
    },
  })
}

export function useDeleteWorkoutSession() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionId: number) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return deleteWorkoutSession(user.id, sessionId, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions', user?.id] })
    },
  })
}
