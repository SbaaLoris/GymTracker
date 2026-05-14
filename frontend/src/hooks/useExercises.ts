import { useQuery } from '@tanstack/react-query'
import { listExercises } from '@/api/exercises'
import type { Credentials } from '@/api/client'

export function useExercises(credentials: Credentials) {
    return useQuery({
        queryKey: ['exercises'],
        queryFn: () => listExercises(credentials),
    })
}

