import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Users, Building2, ShieldCheck, UserCheck, UserX, Search, Trash2, Check, X, ShieldAlert } from 'lucide-react'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingProps, setLoadingProps] = useState(true)
  
  const [activeTab, setActiveTab] = useState('users')
  
  // Filters
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState('')
  const [userVerifyFilter, setUserVerifyFilter] = useState('')
  
  const [propSearch, setPropSearch] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchProperties()
  }, [])

  async function fetchUsers() {
    setLoadingUsers(true)
    try {
      const { data } = await api.get('/users/admin/users/')
      setUsers(data)
    } catch (err) {
      toast.error('Failed to load users.')
    } finally {
      setLoadingUsers(false)
    }
  }

  async function fetchProperties() {
    setLoadingProps(true)
    try {
      const { data } = await api.get('/properties/admin/properties/')
      setProperties(data)
    } catch (err) {
      toast.error('Failed to load properties.')
    } finally {
      setLoadingProps(false)
    }
  }

  async function handleToggleVerify(user) {
    try {
      const { data } = await api.patch(`/users/admin/users/${user.id}/`, {
        is_verified: !user.is_verified
      })
      setUsers(prev => prev.map(u => u.id === user.id ? data : u))
      toast.success(`${user.username} is now ${data.is_verified ? 'verified' : 'unverified'}.`)
    } catch (err) {
      toast.error('Failed to update verification status.')
    }
  }

  async function handleToggleBlock(user) {
    try {
      const { data } = await api.patch(`/users/admin/users/${user.id}/`, {
        is_active: !user.is_active
      })
      setUsers(prev => prev.map(u => u.id === user.id ? data : u))
      toast.success(`${user.username} has been ${data.is_active ? 'unblocked' : 'blocked'}.`)
    } catch (err) {
      toast.error('Failed to update user block status.')
    }
  }

  async function handleDeleteUser(userId, username) {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"? This cannot be undone.`)) return
    try {
      await api.delete(`/users/admin/users/${userId}/`)
      setUsers(prev => prev.filter(u => u.id !== userId))
      // Also filter out any properties owned by this user
      setProperties(prev => prev.filter(p => p.owner !== userId))
      toast.success(`User "${username}" has been deleted.`)
    } catch (err) {
      toast.error('Failed to delete user.')
    }
  }

  async function handleDeleteProperty(propertyId, title) {
    if (!window.confirm(`Are you sure you want to delete property "${title}"?`)) return
    try {
      await api.delete(`/properties/${propertyId}/`)
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      toast.success(`Property "${title}" has been removed.`)
    } catch (err) {
      toast.error('Failed to remove property.')
    }
  }

  // Filter computation
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
      
    const matchesRole = userRoleFilter ? u.role === userRoleFilter : true
    const matchesStatus = userStatusFilter ? (userStatusFilter === 'active' ? u.is_active : !u.is_active) : true
    const matchesVerify = userVerifyFilter ? (userVerifyFilter === 'verified' ? u.is_verified : !u.is_verified) : true
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerify
  })

  const filteredProperties = properties.filter(p => {
    return p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
           p.location.toLowerCase().includes(propSearch.toLowerCase()) ||
           p.owner_name.toLowerCase().includes(propSearch.toLowerCase())
  })

  // Stats
  const stats = {
    totalUsers: users.length,
    totalProperties: properties.length,
    unverifiedLandlords: users.filter(u => (u.role === 'landlord' || u.role === 'seller') && !u.is_verified).length,
    blockedUsers: users.filter(u => !u.is_active).length
  }

  return (
    <div className="page admin-dashboard">
      <div className="dashboard-header">
        <h1>System Administrator Panel</h1>
        <p>Manage users, verify host credentials, and oversee listings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={24} />
          <span>{stats.totalUsers}</span>
          <label>Total Registered Users</label>
        </div>
        <div className="stat-card">
          <Building2 size={24} />
          <span>{stats.totalProperties}</span>
          <label>Total Posted Listings</label>
        </div>
        <div className="stat-card">
          <ShieldCheck size={24} />
          <span>{stats.unverifiedLandlords}</span>
          <label>Pending Verifications</label>
        </div>
        <div className="stat-card">
          <ShieldAlert size={24} />
          <span>{stats.blockedUsers}</span>
          <label>Blocked Accounts</label>
        </div>
      </div>

      <div className="tab-container" style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('users')}
        >
          User Accounts ({filteredUsers.length})
        </button>
        <button 
          className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('properties')}
        >
          Property Listings ({filteredProperties.length})
        </button>
      </div>

      {activeTab === 'users' ? (
        <section className="dashboard-section">
          <h2>User Accounts Management</h2>
          
          <div className="filters-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <div className="search-box">
              <Search size={16} />
              <input 
                placeholder="Search username, email, name..." 
                value={userSearch} 
                onChange={e => setUserSearch(e.target.value)} 
              />
            </div>
            
            <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>

            <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            <select value={userVerifyFilter} onChange={e => setUserVerifyFilter(e.target.value)}>
              <option value="">All Verifications</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {loadingUsers ? (
            <div className="loading">Loading accounts...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty">No users match the search filters.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {u.profile_picture ? (
                          <img 
                            src={u.profile_picture} 
                            alt="" 
                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            {u.username[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{u.username}</strong>
                          <div style={{ fontSize: '11px', color: '#666' }}>{u.first_name} {u.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                    <td>
                      {(u.role === 'landlord' || u.role === 'seller') ? (
                        <span className={`badge badge-${u.is_verified ? 'available' : 'taken'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {u.is_verified ? <Check size={12} /> : <X size={12} />}
                          {u.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${u.is_active ? 'available' : 'failed'}`}>
                        {u.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {(u.role === 'landlord' || u.role === 'seller') && (
                          <button 
                            className={`btn-sm ${u.is_verified ? 'btn-outline' : 'btn-primary'}`} 
                            onClick={() => handleToggleVerify(u)}
                          >
                            {u.is_verified ? 'Unverify' : 'Verify'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            className={`btn-sm ${u.is_active ? 'btn-outline' : 'btn-primary'}`} 
                            style={{ borderColor: u.is_active ? '#d9534f' : '', color: u.is_active ? '#d9534f' : '' }}
                            onClick={() => handleToggleBlock(u)}
                          >
                            {u.is_active ? 'Block' : 'Unblock'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            className="btn-sm" 
                            style={{ background: '#d9534f', color: '#fff', border: 'none' }}
                            onClick={() => handleDeleteUser(u.id, u.username)}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ) : (
        <section className="dashboard-section">
          <h2>Property Listings Oversight</h2>

          <div className="filters-bar" style={{ marginBottom: '20px' }}>
            <div className="search-box">
              <Search size={16} />
              <input 
                placeholder="Search listing title, location, owner..." 
                value={propSearch} 
                onChange={e => setPropSearch(e.target.value)} 
              />
            </div>
          </div>

          {loadingProps ? (
            <div className="loading">Loading listings...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="empty">No properties found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ fontSize: '11px', color: '#666' }}>{p.listing_type.replace('_', ' ')}</div>
                    </td>
                    <td>{p.location}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.property_type === 'rental' ? 'Rental' : 'For Sale'}</td>
                    <td>KES {Number(p.price).toLocaleString()}</td>
                    <td>{p.owner_name}</td>
                    <td>
                      <button 
                        className="btn-sm" 
                        style={{ background: '#d9534f', color: '#fff', border: 'none' }}
                        onClick={() => handleDeleteProperty(p.id, p.title)}
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  )
}
