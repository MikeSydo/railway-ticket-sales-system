import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return <div className="loading-screen">Перевіряємо сесію...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
