import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, LogOut, User, MessageSquare, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

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
    setMenuOpen(false)
    navigate('/')
  }

  const dashboardPath = user ? `/${user.role}/dashboard` : '/login'

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        <Home size={20} /> Room<span>Hub</span>
      </Link>
      
      {/* Mobile Toggle Button */}
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/properties" onClick={() => setMenuOpen(false)}>Browse</Link>
        {user ? (
          <>
            <Link to={dashboardPath} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/messages" className="nav-link-with-badge" onClick={() => setMenuOpen(false)}>
              <MessageSquare size={16} />
              {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}><User size={16} /></Link>
            <button onClick={handleLogout} className="btn-icon"><LogOut size={16} /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
