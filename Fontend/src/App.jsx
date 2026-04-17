import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import PropertyForm from './pages/PropertyForm'
import PropertyRules from './pages/PropertyRules'
import Dashboard from './pages/Dashboard'
import LandlordDashboard from './pages/dashboards/LandlordDashboard.jsx'
import TenantDashboard from './pages/dashboards/TenantDashboard.jsx'
import SellerDashboard from './pages/dashboards/SellerDashboard.jsx'
import BuyerDashboard from './pages/dashboards/BuyerDashboard.jsx'
import TicketForm from './pages/TicketForm'
import TicketDetail from './pages/TicketDetail'
import PaymentForm from './pages/PaymentForm'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Help from './pages/Help'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />

          {/* Role redirect */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Landlord */}
          <Route path="/landlord/dashboard" element={<ProtectedRoute roles={['landlord']}><LandlordDashboard /></ProtectedRoute>} />
          <Route path="/landlord/properties/new" element={<ProtectedRoute roles={['landlord']}><PropertyForm /></ProtectedRoute>} />
          <Route path="/landlord/properties/:id" element={<ProtectedRoute roles={['landlord']}><PropertyForm /></ProtectedRoute>} />
          <Route path="/landlord/properties/:id/rules" element={<ProtectedRoute roles={['landlord']}><PropertyRules /></ProtectedRoute>} />
          <Route path="/landlord/tickets/:id" element={<ProtectedRoute roles={['landlord']}><TicketDetail /></ProtectedRoute>} />

          {/* Tenant */}
          <Route path="/tenant/dashboard" element={<ProtectedRoute roles={['tenant']}><TenantDashboard /></ProtectedRoute>} />
          <Route path="/tenant/tickets/new" element={<ProtectedRoute roles={['tenant']}><TicketForm /></ProtectedRoute>} />
          <Route path="/tenant/pay" element={<ProtectedRoute roles={['tenant']}><PaymentForm /></ProtectedRoute>} />

          {/* Seller */}
          <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/properties/new" element={<ProtectedRoute roles={['seller']}><PropertyForm /></ProtectedRoute>} />
          <Route path="/seller/properties/:id" element={<ProtectedRoute roles={['seller']}><PropertyForm /></ProtectedRoute>} />

          {/* Buyer */}
          <Route path="/buyer/dashboard" element={<ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />

          {/* Shared */}
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  )
}
