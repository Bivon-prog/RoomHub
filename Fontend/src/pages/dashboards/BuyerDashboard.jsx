import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Search, MessageSquare } from 'lucide-react'

export default function BuyerDashboard() {
  const { user } = useAuth()
  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.first_name}</h1>
      </div>
      <div className="roles-grid">
        <Link to="/properties?property_type=sale" className="role-card">
          <Search size={32}/>
          <h3>Browse Properties for Sale</h3>
          <p>Find land, apartments, mansions and more.</p>
        </Link>
        <Link to="/messages" className="role-card">
          <MessageSquare size={32}/>
          <h3>My Messages</h3>
          <p>Chat with property sellers.</p>
        </Link>
      </div>
    </div>
  )
}
