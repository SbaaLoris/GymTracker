import { Routes, Route, Link } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ExercisesPage from '@/pages/ExercisesPage'

function App() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <nav className="mb-6 flex gap-4 border-b pb-2">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/exercises" className="text-blue-600 hover:underline">Exercises</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
      </Routes>
    </div>
  )
}

export default App