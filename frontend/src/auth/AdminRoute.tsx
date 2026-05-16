import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { toast } from "sonner"

function AdminRedirect() {
  React.useEffect(() => {
    toast.error("Admin access required")
  }, [])
  return <Navigate to="/" replace />
}

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
    return <AdminRedirect />
  }

  return <>{children}</>
}
