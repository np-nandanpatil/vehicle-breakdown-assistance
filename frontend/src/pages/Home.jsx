import { Link } from 'react-router-dom';
import './pages.css';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Vehicle Breakdown Assistance</h1>
            <p>Get instant help for your vehicle problems 24/7</p>
            <p className="hero-subtitle">Expert solutions with video tutorials for all vehicle types</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Vehicle Support</h3>
              <p>Get help for 2-wheelers, 3-wheelers, and 4-wheelers. We cover all common vehicle types and their specific issues.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Video Solutions</h3>
              <p>Learn from expert video tutorials that show step-by-step solutions to vehicle problems.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Location Tracking</h3>
              <p>Share your location for quick service dispatch. We know exactly where you need help.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Verified Feedback</h3>
              <p>See real feedback from other users. Trust our community-verified solutions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>24/7 Available</h3>
              <p>Get help anytime, anywhere. Our solutions are always available when you need them.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Quick Solutions</h3>
              <p>Fast, reliable, and practical solutions to get you back on the road quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Create your account in seconds</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select Vehicle</h3>
              <p>Choose your vehicle type</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Find Problems</h3>
              <p>Browse common issues</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Solutions</h3>
              <p>Watch video tutorials</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Help?</h2>
          <p>Join thousands of users who have solved their vehicle problems with us</p>
          <Link to="/register" className="btn btn-primary btn-lg">Start Now</Link>
        </div>
      </section>
    </div>
  );
}