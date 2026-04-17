import { Link } from 'react-router-dom'
import { Home, Key, Building2, Users, Search, Shield, Clock, Star } from 'lucide-react'

const roles = [
  { icon: <Key size={26} />, title: 'Landlords', desc: 'List vacancies, manage tenants, track rent and run financial reports.', link: '/register?role=landlord', gold: false },
  { icon: <Users size={26} />, title: 'Tenants', desc: 'Find your perfect home, pay rent online and raise maintenance tickets.', link: '/register?role=tenant', gold: true },
  { icon: <Building2 size={26} />, title: 'Property Sellers', desc: 'List land, apartments or houses for sale with full legal documentation.', link: '/register?role=seller', gold: false },
  { icon: <Home size={26} />, title: 'Property Buyers', desc: 'Browse verified properties and connect directly with sellers.', link: '/register?role=buyer', gold: false },
]

const features = [
  { icon: <Search size={22} />, title: 'Smart Search', desc: 'Filter by location, size, price and amenities instantly.' },
  { icon: <Shield size={22} />, title: 'Verified Listings', desc: 'Every property is reviewed before going live on the platform.' },
  { icon: <Clock size={22} />, title: 'Real-Time Updates', desc: 'Get notified the moment a property matches your criteria.' },
  { icon: <Star size={22} />, title: 'Trusted Platform', desc: 'Thousands of landlords and tenants trust RoomHub daily.' },
]

export default function Landing() {
  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Kenya's Premier Property Platform</p>
          <h1>Find Your <span>Perfect</span><br />Space Today</h1>
          <p className="hero-desc">
            Rent, buy, or sell property with confidence. RoomHub connects landlords,
            tenants, sellers and buyers in one seamless platform.
          </p>
          <div className="hero-actions">
            <Link to="/properties" className="btn-primary">Browse Properties</Link>
            <Link to="/register" className="btn-outline">Get Started Free</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>1,200+</span><label>Active Listings</label></div>
            <div className="hero-stat"><span>850+</span><label>Happy Tenants</label></div>
            <div className="hero-stat"><span>320+</span><label>Verified Landlords</label></div>
            <div className="hero-stat"><span>98%</span><label>Satisfaction Rate</label></div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="search-section">
        <div className="search-bar-wrap">
          <input placeholder="Search by location, e.g. Nairobi, Westlands..." />
          <select>
            <option value="">All Types</option>
            <option value="rental">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
          <select>
            <option value="">All Listings</option>
            <option value="single_room">Single Room</option>
            <option value="One_Bedroom">One Bed Room</option>
            <option value="Two_Bedroom">Two Bedroom</option>
            <option value= "Three_Bedroom">Three Bedroom</option>
            <option value="bedsitter">Bedsitter</option>
            <option value="apartment">Apartment</option>
            <option value="mansion">Mansion</option>
            <option value="land">Land</option>
          </select>
          <Link to="/properties" className="btn-primary">Search</Link>
        </div>
      </div>

      {/* ── FEATURES STRIP ── */}
      <div className="features-strip">
        <div className="features-strip-inner">
          {features.map(f => (
            <div className="feature-item" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO ARE YOU ── */}
      <section className="roles-section">
        <div className="roles-header">
          <div>
            <span className="section-label">Get Started</span>
            <h2 className="section-title">Who Are You?</h2>
            <p className="section-sub">Choose your role for a tailored experience built around your needs.</p>
          </div>
          <Link to="/register" className="btn-outline-dark">Create Account</Link>
        </div>
        <div className="roles-grid">
          {roles.map(r => (
            <Link to={r.link} key={r.title} className={`role-card ${r.gold ? 'gold-card' : ''}`}>
              <div className="role-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <span className="card-link">Get Started</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INFO / CTA ── */}
      <div className="info-section">
        <div className="info-block dark">
          <span className="section-label">Help & Support</span>
          <h2 className="section-title">We're Here<br />To Help You</h2>
          <p className="section-sub">Our support team is available around the clock to assist with any questions, issues or guidance you need.</p>
          <Link to="/help" className="btn-primary">Visit Help Center</Link>
        </div>
        <div className="info-block light">
          <span className="section-label">Contact Us</span>
          <h2 className="section-title">Get In<br />Touch Today</h2>
          <p className="section-sub">Have a question, feedback or a partnership inquiry? We'd love to hear from you. Reach out anytime.</p>
          <Link to="/contact" className="btn-outline-dark">Send a Message</Link>
        </div>
      </div>

    </div>
  )
}
