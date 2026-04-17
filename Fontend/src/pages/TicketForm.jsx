import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function TicketForm() {
  const navigate = useNavigate()
  const [units, setUnits] = useState([])
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  useEffect(() => { api.get('/properties/units/').then(r => setUnits(r.data.filter(u => u.is_active))) }, [])

  async function onSubmit(data) {
    try {
      await api.post('/tickets/', data)
      toast.success('Ticket submitted!')
      navigate('/tenant/dashboard')
    } catch { toast.error('Failed to submit ticket.') }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Submit a Ticket</h2>
        <div className="form-group">
          <label>Property</label>
          <select {...register('property', { required: true })}>
            <option value="">Select property...</option>
            {units.map(u => <option key={u.id} value={u.property}>{u.property_title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select {...register('category', { required: true })}>
            <option value="maintenance">Maintenance</option>
            <option value="complaint">Complaint</option>
            <option value="compliment">Compliment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group"><label>Subject</label><input {...register('subject', { required: true })} placeholder="Brief subject" /></div>
        <div className="form-group"><label>Description</label><textarea {...register('description', { required: true })} rows={5} placeholder="Describe the issue..." /></div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}
