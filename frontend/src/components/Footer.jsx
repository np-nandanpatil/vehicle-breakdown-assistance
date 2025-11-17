import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Vehicle Breakdown Assistance</h3>
            <p>Your trusted 24/7 vehicle breakdown service for quick solutions.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@vba.com</p>
            <p>Phone: 1-800-VBA-HELP</p>
            <p>Available 24/7</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Vehicle Breakdown Assistance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}