import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'

const ROLES = ['landlord', 'tenant', 'seller', 'buyer']

export default function Register() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: params.get('role') || 'tenant' }
  })

  async function onSubmit(data) {
    try {
      await api.post('/users/register/', data)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data
      toast.error(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Registration failed.')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Account</h2>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input {...register('first_name', { required: true })} placeholder="First name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input {...register('last_name', { required: true })} placeholder="Last name" />
          </div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input {...register('username', { required: true })} placeholder="Username" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email', { required: true })} placeholder="Email" />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input {...register('phone')} placeholder="+254..." />
        </div>

        <div className="form-group">
          <label>I am a</label>
          <select {...register('role', { required: true })}>
            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="Password (min 6 characters)" />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" {...register('password2', { required: true })} placeholder="Confirm password" />
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}
