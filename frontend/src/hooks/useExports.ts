import { useMutation } from '@tanstack/react-query'
import { exportWorkouts, exportBodyMetrics } from '@/api/export'
import { useAuth } from '@/auth/AuthContext'

export function useExportWorkouts() {
  const { credentials, user } = useAuth()
  
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'pdf'; filters?: { from?: string; to?: string } }) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return exportWorkouts(user.id, format, credentials, filters)
    },
  })
}

export function useExportBodyMetrics() {
  const { credentials, user } = useAuth()
  
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'pdf'; filters?: { from?: string; to?: string } }) => {
      if (!credentials || !user?.id) throw new Error('Unauthorized')
      return exportBodyMetrics(user.id, format, credentials, filters)
    },
  })
}
