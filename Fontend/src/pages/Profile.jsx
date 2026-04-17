import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, fetchProfile } = useAuth()
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (user) {
      ['first_name','last_name','email','phone'].forEach(k => setValue(k, user[k]))
    }
  }, [user])

  async function onSubmit(data) {
    try {
      await api.patch('/users/profile/', data)
      await fetchProfile()
      toast.success('Profile updated!')
    } catch { toast.error('Update failed.') }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>My Profile</h2>
        <p className="role-badge">Role: {user?.role}</p>
        <div className="form-row">
          <div className="form-group"><label>First Name</label><input {...register('first_name')} /></div>
          <div className="form-group"><label>Last Name</label><input {...register('last_name')} /></div>
        </div>
        <div className="form-group"><label>Email</label><input type="email" {...register('email')} /></div>
        <div className="form-group"><label>Phone</label><input {...register('phone')} /></div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
