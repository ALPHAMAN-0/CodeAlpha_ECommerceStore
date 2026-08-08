import axiosClient from './axiosClient'

// POST /api/auth/register -> { user, token }
export async function registerUser({ name, email, password }) {
  const { data } = await axiosClient.post('/auth/register', { name, email, password })
  return data
}

// POST /api/auth/login -> { user, token }
export async function loginUser({ email, password }) {
  const { data } = await axiosClient.post('/auth/login', { email, password })
  return data
}

// GET /api/auth/me -> { user } (protected) — used to verify/rehydrate a stored token
export async function fetchCurrentUser() {
  const { data } = await axiosClient.get('/auth/me')
  return data?.user ?? data
}
