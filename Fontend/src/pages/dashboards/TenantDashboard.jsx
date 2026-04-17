import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { Home, DollarSign, Ticket, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TenantDashboard() {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [payments, setPayments] = useState([])
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    api.get('/properties/units/').then(r => setUnits(r.data))
    api.get('/payments/').then(r => setPayments(r.data))
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  const activeUnit = units.find(u => u.is_active)

  async function downloadReceipt(id) {
    const res = await api.get(`/payments/${id}/receipt/`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = `receipt_${id}.txt`; a.click()
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.first_name}</h1>
        <Link to="/properties" className="btn-outline">Browse Houses</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><Home size={24}/><span>{activeUnit ? activeUnit.property_title : 'None'}</span><label>Current Unit</label></div>
        <div className="stat-card"><DollarSign size={24}/><span>{payments.filter(p=>p.status==='pending').length}</span><label>Pending Payments</label></div>
        <div className="stat-card"><Ticket size={24}/><span>{tickets.filter(t=>t.status==='open').length}</span><label>Open Tickets</label></div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Payments</h2>
            <Link to="/tenant/pay" className="btn-primary btn-sm">Make Payment</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Property</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.property_title}</td>
                  <td>KES {Number(p.amount).toLocaleString()}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '-'}</td>
                  <td>{p.status==='verified' && (
                    <button className="btn-sm btn-outline" onClick={()=>downloadReceipt(p.id)}>
                      <Download size={14}/> Receipt
                    </button>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Tickets</h2>
            <Link to="/tenant/tickets/new" className="btn-primary btn-sm">New Ticket</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Subject</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>{t.subject}</td><td>{t.category}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
