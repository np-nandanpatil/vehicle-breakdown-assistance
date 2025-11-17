import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ManageProblems() {
  const [problems, setProblems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleType: '',
    solutionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProblems();
    fetchVehicles();
  }, []);

  const fetchProblems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'problems'));
      const problemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProblems(problemsList);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type
      }));
      setVehicles(vehiclesList);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.title || !formData.vehicleType) {
        throw new Error('Title and vehicle type are required');
      }

      await addDoc(collection(db, 'problems'), {
        title: formData.title,
        description: formData.description,
        vehicleType: formData.vehicleType,
        solutionId: formData.solutionId || '',
        createdAt: new Date()
      });

      setMessage('Problem added successfully!');
      setFormData({ title: '', description: '', vehicleType: '', solutionId: '' });
      fetchProblems();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteDoc(doc(db, 'problems', id));
        setMessage('Problem deleted successfully!');
        fetchProblems();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manage Problem Types</h1>
        <p>Add, edit, and delete problem categories for vehicles</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {/* Add Problem Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Add New Problem Type</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label htmlFor="title">Problem Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Engine Won't Start"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem..."
              rows="3"
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Type</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.type}>{v.type}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="solutionId">Solution ID (Optional)</label>
              <input
                type="text"
                id="solutionId"
                name="solutionId"
                value={formData.solutionId}
                onChange={handleChange}
                placeholder="Link to solution"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : '+ Add Problem'}
          </button>
        </form>
      </div>

      {/* Problems List */}
      <div className="card">
        <h2>All Problem Types</h2>
        {problems.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#64748b' }}>No problems added yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Vehicle Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map(problem => (
                  <tr key={problem.id}>
                    <td><strong>{problem.title}</strong></td>
                    <td>{problem.vehicleType}</td>
                    <td>{problem.description?.substring(0, 50)}...</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}