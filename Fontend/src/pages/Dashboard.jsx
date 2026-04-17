import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const map = { landlord: '/landlord/dashboard', tenant: '/tenant/dashboard', seller: '/seller/dashboard', buyer: '/buyer/dashboard', admin: '/admin/dashboard' }
  return <Navigate to={map[user.role] || '/'} replace />
}
