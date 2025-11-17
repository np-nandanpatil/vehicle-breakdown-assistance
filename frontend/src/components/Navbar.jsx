import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ user, isAdmin }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          🚗 VBA
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          
          {isAdmin ? (
            <>
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin/vehicles">Vehicles</Link></li>
              <li><Link to="/admin/problems">Problems</Link></li>
              <li><Link to="/admin/solutions">Solutions</Link></li>
              <li><Link to="/admin/feedback">Feedback</Link></li>
              <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
            </>
          ) : user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/select-vehicle">Get Help</Link></li>
              <li><Link to="/feedback">Give Feedback</Link></li>
              <li><Link to="/all-feedback">View Feedback</Link></li>
              <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}