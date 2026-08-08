import { createContext, useEffect, useReducer } from 'react'
import axiosClient, { setUnauthorizedHandler } from '../api/axiosClient'
import { fetchCurrentUser, loginUser, registerUser } from '../api/authApi'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const AuthContext = createContext(null)

function readInitialAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const rawUser = localStorage.getItem(USER_KEY)
    const user = rawUser ? JSON.parse(rawUser) : null
    // isLoading starts true only when there's a token to verify against /auth/me;
    // with no token there's nothing to rehydrate, so skip the loading flash entirely.
    return { user, token, isLoading: Boolean(token) }
  } catch {
    return { user: null, token: null, isLoading: false }
  }
}

function persistSession(user, token) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  delete axiosClient.defaults.headers.common.Authorization
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isLoading: false }
    case 'ME_SUCCESS':
      return { ...state, user: action.payload.user, isLoading: false }
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false }
    case 'DONE_LOADING':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, readInitialAuth)

  // Rehydrate/verify a stored token on first mount, and let a global 401
  // (from axiosClient's response interceptor) log the session out reactively —
  // ProtectedRoute picks up the resulting user:null on its own re-render.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      dispatch({ type: 'LOGOUT' })
    })

    if (!state.token) return

    axiosClient.defaults.headers.common.Authorization = `Bearer ${state.token}`

    let cancelled = false
    fetchCurrentUser()
      .then((user) => {
        if (cancelled) return
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        dispatch({ type: 'ME_SUCCESS', payload: { user } })
      })
      .catch(() => {
        if (cancelled) return
        clearSession()
        dispatch({ type: 'LOGOUT' })
      })

    return () => {
      cancelled = true
    }
    // Runs once on mount by design — token changes are driven by login/logout below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login({ email, password }) {
    const { user, token } = await loginUser({ email, password })
    persistSession(user, token)
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    return user
  }

  async function register({ name, email, password }) {
    const { user, token } = await registerUser({ name, email, password })
    persistSession(user, token)
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    return user
  }

  function logout() {
    clearSession()
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: Boolean(state.user),
    isLoading: state.isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
