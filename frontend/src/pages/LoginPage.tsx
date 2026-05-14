import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { useAuth } from '@/auth/AuthContext'

type LocationState = {
    from?: {
        pathname?: string
    }
}

function LoginPage() {
    const { login, status } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const from =
        (location.state as LocationState | null)?.from?.pathname ?? '/exercises'

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            await login({ username, password })
            navigate(from, { replace: true })
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setError('Username oder Passwort ist falsch.')
            } else {
                setError('Login fehlgeschlagen. Prüfe Backend und Netzwerk.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === 'checking') {
        return <div className="p-4">Prüfe Anmeldung…</div>
    }

    return (
        <div className="max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

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
                        Passwort
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full border rounded px-3 py-2"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {isSubmitting ? 'Login läuft…' : 'Einloggen'}
                </button>
            </form>
        </div>
    )
}

export default LoginPage