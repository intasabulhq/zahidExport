import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

function ProtectedAdminRoute() {
  const { admin, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) return <div className="admin-loading">Checking secure session…</div>
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location }} />
  return <Outlet />
}

export default ProtectedAdminRoute
