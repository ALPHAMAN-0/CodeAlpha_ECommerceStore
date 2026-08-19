import axios from 'axios'

// VITE_API_URL is inlined at build time. In dev we fall back to the local API;
// in a production build a missing value would otherwise silently ship a dead
// localhost URL to visitors, so fail loudly instead.
const baseURL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : undefined)

if (!baseURL) {
  throw new Error(
    'VITE_API_URL is not set — define it in the deploy environment (e.g. Vercel) before building.',
  )
}

const axiosClient = axios.create({ baseURL })

// Registered by AuthProvider on mount so a global 401 (expired/invalid token)
// can clear the session even though this module lives outside the React tree.
let unauthorizedHandler = null
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

// Belt-and-suspenders: the request interceptor always reads the latest token
// from localStorage, while AuthContext also sets the axios default header on
// login/logout (per the plan). Either mechanism alone would work; keeping both
// means a request fired before AuthContext mounts is still authenticated.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

// Normalizes whatever shape the backend's error responses take
// ({message} | {error} | plain string) into a single displayable string.
export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (error?.message) return error.message
  return fallback
}

export default axiosClient
