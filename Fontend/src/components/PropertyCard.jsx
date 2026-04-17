import { Link } from 'react-router-dom'
import { MapPin, DollarSign, Home } from 'lucide-react'

export default function PropertyCard({ property }) {
  const image = property.images?.[0]?.image || '/placeholder.jpg'
  return (
    <div className="property-card">
      <img src={image} alt={property.title} className="property-card-img" />
      <div className="property-card-body">
        <span className={`badge badge-${property.property_type}`}>
          {property.property_type === 'rental' ? 'For Rent' : 'For Sale'}
        </span>
        <h3>{property.title}</h3>
        <p className="property-meta"><MapPin size={14} /> {property.location}</p>
        <p className="property-meta"><Home size={14} /> {property.listing_type} {property.size && `· ${property.size}`}</p>
        <p className="property-price"><DollarSign size={14} /> KES {Number(property.price).toLocaleString()}</p>
        <Link to={`/properties/${property.id}`} className="btn-primary btn-sm">View Details</Link>
      </div>
    </div>
  )
}
