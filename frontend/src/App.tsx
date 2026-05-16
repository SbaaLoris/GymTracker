import { Route, Routes, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { AdminRoute } from '@/auth/AdminRoute'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ExercisesPage from '@/pages/ExercisesPage'

// Placeholders
import DashboardPage from '@/pages/DashboardPage'
import PlansPage from '@/pages/PlansPage'
import NewPlanPage from '@/pages/NewPlanPage'
import PlanDetailPage from '@/pages/PlanDetailPage'
import EditPlanPage from '@/pages/EditPlanPage'
import WorkoutsPage from '@/pages/WorkoutsPage'
import NewWorkoutPage from '@/pages/NewWorkoutPage'
import WorkoutDetailPage from '@/pages/WorkoutDetailPage'
import EditWorkoutPage from '@/pages/EditWorkoutPage'
import ProgressPage from '@/pages/ProgressPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminExercisesPage from '@/pages/AdminExercisesPage'
import AdminRequestsPage from '@/pages/AdminRequestsPage'
import AdminTemplatesPage from '@/pages/AdminTemplatesPage'

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* User Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />
        
        <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
        <Route path="/plans/new" element={<ProtectedRoute><NewPlanPage /></ProtectedRoute>} />
        <Route path="/plans/:planId" element={<ProtectedRoute><PlanDetailPage /></ProtectedRoute>} />
        <Route path="/plans/:planId/edit" element={<ProtectedRoute><EditPlanPage /></ProtectedRoute>} />
        
        <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
        <Route path="/workouts/new" element={<ProtectedRoute><NewWorkoutPage /></ProtectedRoute>} />
        <Route path="/workouts/:sessionId" element={<ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>} />
        <Route path="/workouts/:sessionId/edit" element={<ProtectedRoute><EditWorkoutPage /></ProtectedRoute>} />
        
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/exercises" element={<AdminRoute><AdminExercisesPage /></AdminRoute>} />
        <Route path="/admin/requests" element={<AdminRoute><AdminRequestsPage /></AdminRoute>} />
        <Route path="/admin/templates" element={<AdminRoute><AdminTemplatesPage /></AdminRoute>} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  )
}

export default App
