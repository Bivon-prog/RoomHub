import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, LogOut, User, MessageSquare, Bell } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const dashboardPath = user ? `/${user.role}/dashboard` : '/login'

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Home size={20} /> Room<span>Hub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/properties">Browse</Link>
        {user ? (
          <>
            <Link to={dashboardPath}>Dashboard</Link>
            <Link to="/messages"><MessageSquare size={16} /></Link>
            <Link to="/profile"><User size={16} /></Link>
            <button onClick={handleLogout} className="btn-icon"><LogOut size={16} /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
