import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  loginByPhone,
  registerByPhone,
} from '../services/authService'

const AUTH_TOKEN_KEY = 'railway-auth-token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setIsAuthLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadCurrentUser() {
      try {
        setIsAuthLoading(true)
        const currentUser = await getCurrentUser(token, controller.signal)
        setUser(currentUser)
      } catch (_error) {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setToken('')
        setUser(null)
      } finally {
        if (!controller.signal.aborted) {
          setIsAuthLoading(false)
        }
      }
    }

    loadCurrentUser()

    return () => controller.abort()
  }, [token])

  async function signIn(values) {
    const data = await loginByPhone(values)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function signUp(values) {
    const data = await registerByPhone(values)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function signOut() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user && token),
      isAuthLoading,
      signIn,
      signUp,
      signOut,
      token,
      user,
    }),
    [isAuthLoading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
