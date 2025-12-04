import { Link } from 'react-router-dom';
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
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: shreeharshag027@gmail.com</p>
            <p>Phone: 7019669276-HELP</p>
            <p>Available 24/7</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Vehicle Breakdown Assistance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}