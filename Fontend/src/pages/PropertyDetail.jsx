import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { MapPin, Home, DollarSign, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PropertyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    api.get(`/properties/${id}/`).then(r => setProperty(r.data))
  }, [id])

  if (!property) return <div className="loading">Loading...</div>

  const images = property.images || []

  return (
    <div className="page property-detail">
      <div className="detail-gallery">
        {images.length > 0 ? (
          <>
            <img src={images[imgIndex]?.image} alt={property.title} className="detail-main-img" />
            <div className="detail-thumbs">
              {images.map((img, i) => (
                <img key={i} src={img.image} alt="" className={i === imgIndex ? 'active' : ''} onClick={() => setImgIndex(i)} />
              ))}
            </div>
          </>
        ) : <div className="no-image">No images available</div>}
      </div>

      <div className="detail-info">
        <span className={`badge badge-${property.property_type}`}>
          {property.property_type === 'rental' ? 'For Rent' : 'For Sale'}
        </span>
        <h1>{property.title}</h1>
        <p className="property-meta"><MapPin size={16} /> {property.location}</p>
        <p className="property-meta"><Home size={16} /> {property.listing_type} {property.size && `· ${property.size}`}</p>
        <p className="property-price"><DollarSign size={16} /> KES {Number(property.price).toLocaleString()}</p>
        {property.deposit && <p>Deposit: KES {Number(property.deposit).toLocaleString()}</p>}

        <div className="amenities">
          <h3>Amenities</h3>
          <div className="amenity-tags">
            {(property.amenities || []).map(a => <span key={a} className="tag">{a}</span>)}
          </div>
        </div>

        {property.description && (
          <div className="description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>
        )}

        {property.rules?.content && (
          <div className="rules">
            <h3>Rules & Regulations</h3>
            <p>{property.rules.content}</p>
          </div>
        )}

        {property.documents?.length > 0 && (
          <div className="documents">
            <h3>Legal Documents</h3>
            {property.documents.map(doc => (
              <a key={doc.id} href={doc.file} target="_blank" rel="noreferrer" className="doc-link">
                <FileText size={14} /> {doc.title}
              </a>
            ))}
          </div>
        )}

        {property.latitude && property.longitude && (
          <div className="map-link">
            <a href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`} target="_blank" rel="noreferrer" className="btn-outline">
              View on Google Maps
            </a>
          </div>
        )}

        {user && user.role !== property.owner && (
          <Link to={`/messages?to=${property.owner}`} className="btn-primary">
            Contact {property.owner_name}
          </Link>
        )}
      </div>
    </div>
  )
}
