import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, status } = useAuth()
    const location = useLocation()

    if (status === 'checking') {
        return <div className="p-4">Prüfe Anmeldung…</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return <>{children}</>
}