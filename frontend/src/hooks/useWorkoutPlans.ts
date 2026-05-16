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
  const { credentials } = useAuth()
  
  return useQuery({
    queryKey: ['workout-plans', isTemplate],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return listWorkoutPlans(credentials, isTemplate)
    },
    enabled: !!credentials,
  })
}

export function useWorkoutPlan(id: number) {
  const { credentials } = useAuth()
  
  return useQuery({
    queryKey: ['workout-plans', id],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return getWorkoutPlan(id, credentials)
    },
    enabled: !!credentials && !!id,
  })
}

export function useCreateWorkoutPlan() {
  const { credentials } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof WorkoutPlanCreateSchema>) => {
      if (!credentials) throw new Error('Unauthorized')
      return createWorkoutPlan(payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
    },
  })
}

export function useUpdateWorkoutPlan() {
  const { credentials } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: z.infer<typeof WorkoutPlanCreateSchema> }) => {
      if (!credentials) throw new Error('Unauthorized')
      return updateWorkoutPlan(id, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
    },
  })
}

export function useDeleteWorkoutPlan() {
  const { credentials } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return deleteWorkoutPlan(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
    },
  })
}
