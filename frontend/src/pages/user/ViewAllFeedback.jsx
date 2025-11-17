import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ViewAllFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const q = query(
          collection(db, 'feedback'),
          where('approved', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const feedbackList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
        
        setFeedback(feedbackList);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (loading) return <div className="dashboard-container"><p>Loading feedback...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Feedback</h1>
        <p>See what other users are saying about our service</p>
      </div>

      {feedback.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No feedback available yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {feedback.map(item => (
            <div key={item.id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{item.userName}</h3>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>
                    {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>
                </div>
                <div style={{ fontSize: '1.2rem' }}>
                  {renderStars(item.rating)}
                </div>
              </div>

              {item.problemArea && (
                <p style={{ color: '#2563eb', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Problem: {item.problemArea}
                </p>
              )}

              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                {item.feedback}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}