import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ExercisesPage from '@/pages/ExercisesPage'

function App() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <nav className="mb-6 flex items-center gap-4 border-b pb-2">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>

        <Link to="/exercises" className="text-blue-600 hover:underline">
          Exercises
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.username} ({user.role})
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <ExercisesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App