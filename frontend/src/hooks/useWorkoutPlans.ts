import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listWorkoutPlans, 
  getWorkoutPlan, 
  createWorkoutPlan, 
  updateWorkoutPlan, 
  deleteWorkoutPlan 
} from '@/api/workoutPlans'
import { useAuth } from '@/auth/AuthContext'
import type { WorkoutPlanCreateSchema } from '@/schemas'
import { z } from 'zod'

export function useWorkoutPlans(isTemplate?: boolean) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['workout-plans', user?.id, isTemplate],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return listWorkoutPlans(credentials, isTemplate)
    },
    enabled: !!credentials,
  })
}

export function useWorkoutPlan(id: number) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['workout-plans', user?.id, id],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return getWorkoutPlan(id, credentials)
    },
    enabled: !!credentials && !!id,
  })
}

export function useCreateWorkoutPlan() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof WorkoutPlanCreateSchema>) => {
      if (!credentials) throw new Error('Unauthorized')
      return createWorkoutPlan(payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', user?.id] })
    },
  })
}

export function useUpdateWorkoutPlan() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: z.infer<typeof WorkoutPlanCreateSchema> }) => {
      if (!credentials) throw new Error('Unauthorized')
      return updateWorkoutPlan(id, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', user?.id] })
    },
  })
}

export function useDeleteWorkoutPlan() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return deleteWorkoutPlan(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', user?.id] })
    },
  })
}
