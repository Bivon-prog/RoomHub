import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function PaymentForm() {
  const navigate = useNavigate()
  const [units, setUnits] = useState([])
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  useEffect(() => { api.get('/properties/units/').then(r => setUnits(r.data.filter(u => u.is_active))) }, [])

  async function onSubmit(data) {
    try {
      await api.post('/payments/', data)
      toast.success('Payment submitted! Awaiting verification.')
      navigate('/tenant/dashboard')
    } catch { toast.error('Payment failed.') }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Make a Payment</h2>
        <div className="form-group">
          <label>Unit / Property</label>
          <select {...register('unit', { required: true })}>
            <option value="">Select unit...</option>
            {units.map(u => <option key={u.id} value={u.id}>{u.property_title}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Amount (KES)</label><input type="number" {...register('amount', { required: true })} /></div>
        <div className="form-group"><label>Transaction Reference</label><input {...register('transaction_ref', { required: true })} placeholder="e.g. MPESA code" /></div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  )
}
