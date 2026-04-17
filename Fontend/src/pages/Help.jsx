export default function Help() {
  return (
    <div className="page">
      <div className="form-card">
        <h2>Help & Support</h2>
        <p>Welcome to RoomHub support. Here are some common topics:</p>
        <ul className="help-list">
          <li><strong>How to list a property</strong> — Sign up as a Landlord or Seller, then click "Add Property" from your dashboard.</li>
          <li><strong>How to pay rent</strong> — Go to your Tenant dashboard and click "Make Payment". Enter your M-Pesa transaction code.</li>
          <li><strong>How to raise a ticket</strong> — From your Tenant dashboard, click "New Ticket" and describe the issue.</li>
          <li><strong>How to contact a seller/landlord</strong> — Open a property listing and click "Contact Owner".</li>
        </ul>
        <p>Still need help? <a href="/contact">Contact us</a>.</p>
      </div>
    </div>
  )
}
