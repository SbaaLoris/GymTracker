import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ExercisesPage from '@/pages/ExercisesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
