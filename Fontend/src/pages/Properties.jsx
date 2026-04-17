import { useState, useEffect } from 'react'
import api from '../api/axios'
import PropertyCard from '../components/PropertyCard'
import { Search, SlidersHorizontal } from 'lucide-react'

const LISTING_TYPES = ['', 'single_room', 'bedsitter', 'apartment', 'mansion', 'house', 'land']
const PROPERTY_TYPES = ['', 'rental', 'sale']

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ location: '', listing_type: '', property_type: '', min_price: '', max_price: '', size: '' })

  useEffect(() => { fetchProperties() }, [])

  async function fetchProperties() {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      const { data } = await api.get('/properties/', { params })
      setProperties(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  function handleFilter(e) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <div className="page">
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} />
          <input name="location" placeholder="Search by location..." value={filters.location} onChange={handleFilter} />
        </div>
        <select name="property_type" value={filters.property_type} onChange={handleFilter}>
          <option value="">All Types</option>
          <option value="rental">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
        <select name="listing_type" value={filters.listing_type} onChange={handleFilter}>
          <option value="">All Listings</option>
          {LISTING_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <input name="min_price" type="number" placeholder="Min price" value={filters.min_price} onChange={handleFilter} />
        <input name="max_price" type="number" placeholder="Max price" value={filters.max_price} onChange={handleFilter} />
        <input name="size" placeholder="Size (e.g. 2 bed)" value={filters.size} onChange={handleFilter} />
        <button className="btn-primary" onClick={fetchProperties}><SlidersHorizontal size={16} /> Filter</button>
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="empty">No properties found.</div>
      ) : (
        <div className="properties-grid">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  )
}
