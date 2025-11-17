import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
      if (!formData.name || !formData.type) {
        throw new Error('Name and type are required');
      }

      await addDoc(collection(db, 'vehicles'), {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        createdAt: new Date()
      });

      setMessage('Vehicle added successfully!');
      setFormData({ name: '', type: '', description: '' });
      fetchVehicles();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
        setMessage('Vehicle deleted successfully!');
        fetchVehicles();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manage Vehicle Types</h1>
        <p>Add, edit, and delete vehicle categories</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {/* Add Vehicle Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Add New Vehicle Type</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="name">Vehicle Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g., 2-Wheeler Bikes"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="type">Vehicle Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="E.g., 2-wheeler"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : '+ Add Vehicle'}
          </button>
        </form>
      </div>

      {/* Vehicles List */}
      <div className="card">
        <h2>All Vehicle Types</h2>
        {vehicles.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#64748b' }}>No vehicles added yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td><strong>{vehicle.name}</strong></td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.description || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleDelete(vehicle.id)}
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