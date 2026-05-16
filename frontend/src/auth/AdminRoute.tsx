import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status, user } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== "admin") {
    // If authenticated but not admin, redirect to dashboard or home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
