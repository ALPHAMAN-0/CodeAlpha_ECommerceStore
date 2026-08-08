import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import useAuth from '../../hooks/useAuth'

/**
 * Gates protected pages (/checkout, /orders). Redirects unauthenticated users
 * to /auth, passing the originally intended path via router location state so
 * AuthPage can send them back after a successful login/register.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}
