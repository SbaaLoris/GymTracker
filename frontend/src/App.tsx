import { useExercises } from '@/hooks/useExercises'

// TEMP: wird durch AuthContext in Block 3 ersetzt
const TEMP_CREDENTIALS = {
  username: 'admin',
  password: 'REMOVED_SECRET',
}

function App() {
  const { data, isLoading, error } = useExercises(TEMP_CREDENTIALS)

  if (isLoading) return <div className="p-4">Lade Exercises…</div>
  if (error) return <div className="p-4 text-red-600">Fehler: {error.message}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      <ul className="space-y-1">
        {data?.map((ex) => (
          <li key={ex.id}>
            <span className="font-mono text-sm text-gray-500">#{ex.id}</span>{' '}
            {ex.name} <span className="text-sm text-gray-500">({ex.muscle_group})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App