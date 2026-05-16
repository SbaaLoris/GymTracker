import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listExerciseRequests, 
  getExerciseRequest, 
  createExerciseRequest, 
  deleteExerciseRequest, 
  approveExerciseRequest, 
  denyExerciseRequest 
} from '@/api/exerciseRequests'
import { useAuth } from '@/auth/AuthContext'
import type { ExerciseRequestCreateSchema } from '@/schemas'
import { z } from 'zod'

export function useExerciseRequests(status?: string) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['exercise-requests', user?.id, status],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return listExerciseRequests(credentials, status)
    },
    enabled: !!credentials,
  })
}

export function useExerciseRequest(id: number) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['exercise-requests', user?.id, id],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return getExerciseRequest(id, credentials)
    },
    enabled: !!credentials && !!id,
  })
}

export function useCreateExerciseRequest() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof ExerciseRequestCreateSchema>) => {
      if (!credentials) throw new Error('Unauthorized')
      return createExerciseRequest(payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-requests', user?.id] })
    },
  })
}

export function useDeleteExerciseRequest() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return deleteExerciseRequest(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-requests', user?.id] })
    },
  })
}

export function useApproveExerciseRequest() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return approveExerciseRequest(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-requests', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}

export function useDenyExerciseRequest() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return denyExerciseRequest(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-requests', user?.id] })
    },
  })
}
