import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])

  useEffect(() => { api.get('/properties/mine/').then(r => setProperties(r.data)) }, [])

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.first_name}</h1>
        <Link to="/seller/properties/new" className="btn-primary"><Plus size={16}/> List Property</Link>
      </div>
      <section className="dashboard-section">
        <h2>My Listings</h2>
        <table className="data-table">
          <thead><tr><th>Title</th><th>Type</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td><td>{p.listing_type}</td>
                <td>KES {Number(p.price).toLocaleString()}</td>
                <td><span className={`badge badge-${p.is_available?'available':'taken'}`}>{p.is_available?'Available':'Sold'}</span></td>
                <td><Link to={`/seller/properties/${p.id}`} className="btn-sm btn-outline">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
