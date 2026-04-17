import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function TicketDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)

  useEffect(() => { api.get(`/tickets/${id}/`).then(r => setTicket(r.data)) }, [id])

  async function updateStatus(status) {
    try {
      const { data } = await api.patch(`/tickets/${id}/status/`, { status })
      setTicket(data)
      toast.success('Status updated!')
    } catch { toast.error('Failed to update.') }
  }

  if (!ticket) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="form-card">
        <div className="ticket-header">
          <h2>{ticket.subject}</h2>
          <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
        </div>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Property:</strong> {ticket.property_title}</p>
        <p><strong>Submitted by:</strong> {ticket.submitted_by_name}</p>
        <p><strong>Date:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
        <div className="description"><p>{ticket.description}</p></div>

        {user?.role === 'landlord' && (
          <div className="ticket-actions">
            <h3>Update Status</h3>
            <div className="btn-group">
              {['open','in_progress','resolved'].map(s => (
                <button key={s} className={`btn-outline ${ticket.status===s?'active':''}`} onClick={()=>updateStatus(s)}>
                  {s.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
