import { Link } from 'react-router-dom'
import { Home, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand">
          <div className="footer-logo"><Home size={22} /> RoomHub</div>
          <p className="footer-desc">
            Kenya's premier property platform connecting landlords, tenants,
            sellers and buyers. Find your perfect space today.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><Link to="/properties">Browse Properties</Link></li>
            <li><Link to="/register?role=landlord">List a Property</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Property Types</h4>
          <ul>
            <li><Link to="/properties?listing_type=single_room">Single Rooms</Link></li>
            <li><Link to="/properties?listing_type=bedsitter">Bedsitters</Link></li>
            <li><Link to="/properties?listing_type=apartment">Apartments</Link></li>
            <li><Link to="/properties?listing_type=mansion">Mansions</Link></li>
            <li><Link to="/properties?property_type=sale">For Sale</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <MapPin size={15} />
            <span>Nairobi, Kenya<br />Westlands, Waiyaki Way</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={15} />
            <span>+254 759 249 875</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={15} />
            <span>hello@roomhub.co.ke</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} RoomHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
