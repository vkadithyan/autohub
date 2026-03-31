import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Car } from 'lucide-react';

export default function Vehicles() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '' });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles((res.data.data || []).filter(v => v.customer_id === user.id));
    } catch (err) { console.error(err); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', { ...newVehicle, customer_id: user.id });
      setNewVehicle({ make: '', model: '', year: '' });
      fetchVehicles();
    } catch (err) { alert('Failed to add vehicle'); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
      <div className="glass-panel">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Car size={20} /> Add Vehicle</h3>
        <form onSubmit={handleAddVehicle} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label>Make</label>
            <input type="text" className="input-field" required value={newVehicle.make} onChange={e=>setNewVehicle({...newVehicle, make: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input type="text" className="input-field" required value={newVehicle.model} onChange={e=>setNewVehicle({...newVehicle, model: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input type="number" className="input-field" required value={newVehicle.year} onChange={e=>setNewVehicle({...newVehicle, year: e.target.value})} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} type="submit">Add to Garage</button>
        </form>
      </div>

      <div className="glass-panel">
        <h3>My Garage Garage</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Make</th><th>Model</th><th>Year</th></tr></thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No vehicles registered.</td></tr>
              ) : vehicles.map(v => (
                <tr key={v.id}><td>{v.make}</td><td>{v.model}</td><td>{v.year}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
