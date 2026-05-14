import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { registerUser } from '@/api/auth'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({
        username: username.trim(),
        password,
      })

      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully. You can now log in.',
        },
      })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('This username is already taken.')
      } else {
        setError('Registration failed. Please check the backend and network connection.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
