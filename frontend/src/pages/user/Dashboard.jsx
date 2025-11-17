import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          setUser(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>What would you like to do today?</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/select-vehicle" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
            <h3>Get Help</h3>
            <p>Select your vehicle type and find solutions for your problems.</p>
          </div>
        </Link>

        <Link to="/feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3>Give Feedback</h3>
            <p>Share your experience and help other users.</p>
          </div>
        </Link>

        <Link to="/all-feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
            <h3>View Feedback</h3>
            <p>Read feedback from other users in the community.</p>
          </div>
        </Link>

        <div className="dashboard-card">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
          <h3>Your Phone</h3>
          <p>{user?.phone}</p>
        </div>
      </div>
    </div>
  );
}