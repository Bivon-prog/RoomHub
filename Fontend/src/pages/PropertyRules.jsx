import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function PropertyRules() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    api.get(`/properties/${id}/rules/`).then(r => setValue('content', r.data.content))
  }, [id])

  async function onSubmit({ content }) {
    try {
      await api.put(`/properties/${id}/rules/`, { property: id, content })
      toast.success('Rules updated!')
      navigate(-1)
    } catch { toast.error('Failed to update rules.') }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Rules & Regulations</h2>
        <div className="form-group">
          <label>Property Rules</label>
          <textarea {...register('content', { required: true })} rows={10} placeholder="Enter rules and regulations for tenants..." />
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Rules'}
        </button>
      </form>
    </div>
  )
}
