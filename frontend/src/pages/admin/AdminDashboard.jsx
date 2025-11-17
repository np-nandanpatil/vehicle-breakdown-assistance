import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalProblems: 0,
    totalSolutions: 0,
    totalFeedback: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const vehiclesSnap = await getDocs(collection(db, 'vehicles'));
        const problemsSnap = await getDocs(collection(db, 'problems'));
        const solutionsSnap = await getDocs(collection(db, 'solutions'));
        const feedbackSnap = await getDocs(collection(db, 'feedback'));

        setStats({
          totalVehicles: vehiclesSnap.size,
          totalProblems: problemsSnap.size,
          totalSolutions: solutionsSnap.size,
          totalFeedback: feedbackSnap.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage vehicles, problems, solutions, and feedback</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/vehicles" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
            <h3>Vehicle Types</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalVehicles}
            </p>
            <p>Manage vehicle categories</p>
          </div>
        </Link>

        <Link to="/admin/problems" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3>Problems</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalProblems}
            </p>
            <p>Manage problem categories</p>
          </div>
        </Link>

        <Link to="/admin/solutions" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h3>Solutions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalSolutions}
            </p>
            <p>Manage solutions and videos</p>
          </div>
        </Link>

        <Link to="/admin/feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3>Feedback</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalFeedback}
            </p>
            <p>Review user feedback</p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '3rem', padding: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/vehicles" className="btn btn-primary">
            + Add Vehicle
          </Link>
          <Link to="/admin/problems" className="btn btn-primary">
            + Add Problem
          </Link>
          <Link to="/admin/solutions" className="btn btn-primary">
            + Add Solution
          </Link>
          <Link to="/admin/feedback" className="btn btn-primary">
            View Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}