import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listExercises, 
  getExercise, 
  createExercise, 
  updateExercise, 
  deleteExercise 
} from '@/api/exercises'
import { useAuth } from '@/auth/AuthContext'
import type { ExerciseCreateSchema } from '@/schemas'
import { z } from 'zod'

export function useExercises(filters?: Parameters<typeof listExercises>[1]) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['exercises', user?.id, filters],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return listExercises(credentials, filters)
    },
    enabled: !!credentials,
  })
}

export function useExercise(id: number) {
  const { credentials, user } = useAuth()
  
  return useQuery({
    queryKey: ['exercises', user?.id, id],
    queryFn: () => {
      if (!credentials) throw new Error('Unauthorized')
      return getExercise(id, credentials)
    },
    enabled: !!credentials && !!id,
  })
}

export function useCreateExercise() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof ExerciseCreateSchema>) => {
      if (!credentials) throw new Error('Unauthorized')
      return createExercise(payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises', user?.id] })
    },
  })
}

export function useUpdateExercise() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: z.infer<typeof ExerciseCreateSchema> }) => {
      if (!credentials) throw new Error('Unauthorized')
      return updateExercise(id, payload, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises', user?.id] })
    },
  })
}

export function useDeleteExercise() {
  const { credentials, user } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!credentials) throw new Error('Unauthorized')
      return deleteExercise(id, credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises', user?.id] })
    },
  })
}
