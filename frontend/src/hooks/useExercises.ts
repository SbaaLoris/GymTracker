import { useQuery } from '@tanstack/react-query'
import { listExercises } from '@/api/exercises'
import type { Credentials } from '@/api/client'

export function useExercises(credentials: Credentials | null) {
    return useQuery({
        queryKey: ['exercises', credentials?.username],
        queryFn: () => {
            if (!credentials) {
                throw new Error('Missing credentials')
            }

            return listExercises(credentials)
        },
        enabled: Boolean(credentials),
    })
}