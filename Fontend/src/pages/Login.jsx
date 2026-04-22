import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  async function onSubmit({ username, password }) {
    try {
      await login(username, password)
      toast.success('Welcome back!')
      // redirect based on role stored in context after login
      navigate('/dashboard')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Invalid username or password.'
      toast.error(errorMsg)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input {...register('username', { required: true })} placeholder="Username" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} placeholder="Password" />
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch">No account? <Link to="/register">Sign up</Link></p>
      </form>
    </div>
  )
}
