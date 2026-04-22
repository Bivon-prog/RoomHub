import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, LogOut, User, MessageSquare, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      api.get('/messages/inbox/').then(res => {
        const totalUnread = res.data.reduce((sum, conv) => sum + conv.unread, 0)
        setUnreadCount(totalUnread)
      }).catch(() => setUnreadCount(0))
    }
  }, [user])

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
            <Link to="/messages" className="nav-link-with-badge">
              <MessageSquare size={16} />
              {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}
            </Link>
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
