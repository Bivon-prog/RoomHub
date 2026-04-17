import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { Building2, Users, DollarSign, Ticket, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function VerifyBtn({ id, onDone }) {
  const [loading, setLoading] = useState(false)
  async function verify() {
    setLoading(true)
    await api.patch(`/payments/${id}/verify/`, {})
    onDone()
    setLoading(false)
  }
  return <button className="btn-sm btn-primary" onClick={verify} disabled={loading}>Verify</button>
}

export default function LandlordDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])
  const [tickets, setTickets] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    api.get('/properties/mine/').then(r => setProperties(r.data))
    api.get('/properties/units/').then(r => setTenants(r.data))
    api.get('/payments/').then(r => setPayments(r.data))
    api.get('/tickets/').then(r => setTickets(r.data))
    api.get('/payments/summary/').then(r => setSummary(r.data))
  }, [])

  function refreshPayments() { api.get('/payments/').then(r => setPayments(r.data)) }

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.first_name}</h1>
        <Link to="/landlord/properties/new" className="btn-primary"><Plus size={16} /> Add Property</Link>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><Building2 size={24} /><span>{properties.length}</span><label>Properties</label></div>
        <div className="stat-card"><Users size={24} /><span>{tenants.filter(t => t.is_active).length}</span><label>Active Tenants</label></div>
        <div className="stat-card"><DollarSign size={24} /><span>KES {Number(summary?.total_collected || 0).toLocaleString()}</span><label>Collected</label></div>
        <div className="stat-card"><Ticket size={24} /><span>{tickets.filter(t => t.status === 'open').length}</span><label>Open Tickets</label></div>
      </div>
      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>My Properties</h2>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Type</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td><td>{p.listing_type}</td>
                  <td>KES {Number(p.price).toLocaleString()}</td>
                  <td><span className={`badge badge-${p.is_available ? 'available' : 'taken'}`}>{p.is_available ? 'Available' : 'Occupied'}</span></td>
                  <td>
                    <Link to={`/landlord/properties/${p.id}`} className="btn-sm btn-outline">Manage</Link>
                    {' '}
                    <Link to={`/landlord/properties/${p.id}/rules`} className="btn-sm btn-outline">Rules</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="dashboard-section">
          <h2>Tenants</h2>
          <table className="data-table">
            <thead><tr><th>Tenant</th><th>Property</th><th>Move In</th><th>Active</th></tr></thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.id}>
                  <td>{t.tenant_name}</td><td>{t.property_title}</td>
                  <td>{t.move_in_date}</td>
                  <td><span className={`badge badge-${t.is_active ? 'available' : 'taken'}`}>{t.is_active ? 'Yes' : 'No'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="dashboard-section">
          <h2>Payments</h2>
          <table className="data-table">
            <thead><tr><th>Tenant</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {payments.slice(0, 10).map(p => (
                <tr key={p.id}>
                  <td>{p.tenant_name}</td>
                  <td>KES {Number(p.amount).toLocaleString()}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.status === 'pending' && <VerifyBtn id={p.id} onDone={refreshPayments} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="dashboard-section">
          <h2>Tickets</h2>
          <table className="data-table">
            <thead><tr><th>Subject</th><th>Category</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>{t.subject}</td><td>{t.category}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td><Link to={`/landlord/tickets/${t.id}`} className="btn-sm btn-outline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
