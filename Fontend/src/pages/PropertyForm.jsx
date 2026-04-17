import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const AMENITIES_OPTIONS = ['Water', 'Electricity', 'WiFi', 'Parking', 'Security', 'Shopping Centre', 'School Nearby']

export default function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEdit = Boolean(id)
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm()
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    if (isEdit) {
      api.get(`/properties/${id}/`).then(({ data }) => {
        Object.entries(data).forEach(([k, v]) => setValue(k, v))
        setSelectedAmenities(data.amenities || [])
      })
    }
  }, [id])

  function toggleAmenity(a) {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function onSubmit(data) {
    try {
      data.amenities = selectedAmenities
      data.property_type = user.role === 'landlord' ? 'rental' : 'sale'
      const res = isEdit
        ? await api.patch(`/properties/${id}/`, data)
        : await api.post('/properties/', data)

      // upload images
      for (const file of images) {
        const fd = new FormData()
        fd.append('property', res.data.id)
        fd.append('image', file)
        await api.post('/properties/images/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }

      toast.success(isEdit ? 'Property updated!' : 'Property listed!')
      navigate(user.role === 'landlord' ? '/landlord/dashboard' : '/seller/dashboard')
    } catch (err) {
      toast.error('Failed to save property.')
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>{isEdit ? 'Edit Property' : 'List a Property'}</h2>

        <div className="form-group"><label>Title</label><input {...register('title', { required: true })} placeholder="Property title" /></div>
        <div className="form-row">
          <div className="form-group">
            <label>Listing Type</label>
            <select {...register('listing_type', { required: true })}>
              <option value="">Select...</option>
              {['single_room','bedsitter','apartment','mansion','house','land'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Owner Type</label>
            <select {...register('owner_type')}>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        {watch('owner_type') === 'company' && (
          <div className="form-group"><label>Company Name</label><input {...register('company_name')} placeholder="Company name" /></div>
        )}

        <div className="form-group"><label>Location</label><input {...register('location', { required: true })} placeholder="e.g. Nairobi, Westlands" /></div>
        <div className="form-row">
          <div className="form-group"><label>Latitude</label><input type="number" step="any" {...register('latitude')} placeholder="e.g. -1.286389" /></div>
          <div className="form-group"><label>Longitude</label><input type="number" step="any" {...register('longitude')} placeholder="e.g. 36.817223" /></div>
        </div>
        <div className="form-group"><label>Size</label><input {...register('size')} placeholder="e.g. 2 bedrooms, 50 sqm" /></div>
        <div className="form-row">
          <div className="form-group"><label>Price (KES)</label><input type="number" {...register('price', { required: true })} /></div>
          {user?.role === 'landlord' && <div className="form-group"><label>Deposit (KES)</label><input type="number" {...register('deposit')} /></div>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register('description')} rows={4} placeholder="Describe the property..." />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenity-checkboxes">
            {AMENITIES_OPTIONS.map(a => (
              <label key={a} className="checkbox-label">
                <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Images (min 5 recommended)</label>
          <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} />
          {images.length > 0 && <p>{images.length} image(s) selected</p>}
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Property' : 'List Property'}
        </button>
      </form>
    </div>
  )
}
