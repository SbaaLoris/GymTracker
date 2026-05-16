import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getMe } from '@/api/auth'
import type { Credentials } from '@/api/client'
import type { User } from '@/schemas/user'
import { useQueryClient } from '@tanstack/react-query'

type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

type AuthContextValue = {
  user: User | null
  credentials: Credentials | null
  status: AuthStatus
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'mova_auth_credentials'

function readStoredCredentials(): Credentials | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)

    if (typeof parsed.username === 'string' && typeof parsed.password === 'string') {
      return {
        username: parsed.username,
        password: parsed.password,
      }
    }

    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [status, setStatus] = useState<AuthStatus>('checking')
  const queryClient = useQueryClient()

  useEffect(() => {
    const storedCredentials = readStoredCredentials()

    if (!storedCredentials) {
      setStatus('anonymous')
      return
    }

    getMe(storedCredentials)
      .then((currentUser) => {
        setUser(currentUser)
        setCredentials(storedCredentials)
        setStatus('authenticated')
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY)
        setUser(null)
        setCredentials(null)
        setStatus('anonymous')
      })
  }, [])

  async function login(nextCredentials: Credentials) {
    const currentUser = await getMe(nextCredentials)

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextCredentials))
    setUser(currentUser)
    setCredentials(nextCredentials)
    setStatus('authenticated')
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setCredentials(null)
    setStatus('anonymous')
    queryClient.clear()
  }

  const value = useMemo(
    () => ({
      user,
      credentials,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
    }),
    [user, credentials, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
