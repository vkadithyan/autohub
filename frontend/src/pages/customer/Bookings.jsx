import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Bookings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [newBooking, setNewBooking] = useState({ vehicle_id: '', service_id: '' });

  useEffect(() => {
    fetchBookings();
    fetchVehicles();
    fetchServices();
  }, []);

  const fetchBookings = async () => {
    // Ideally user.id matches customer.id for this demo
    try {
      const res = await api.get('/bookings');
      // Filter client side for simplicity, production would do it server-side
      setBookings((res.data.data || []).filter(b => b.customer_id === user.id));
    } catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles((res.data.data || []).filter(v => v.customer_id === user.id));
    } catch (err) { console.error(err); }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', { ...newBooking, customer_id: user.id });
      setNewBooking({ vehicle_id: '', service_id: '' });
      fetchBookings();
      alert("Booking Request Submitted!");
    } catch (err) { alert('Failed to create booking'); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
      <div className="glass-panel">
        <h3>Request Service</h3>
        <form onSubmit={handleAddBooking} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label>Select Vehicle</label>
            <select className="input-field" required value={newBooking.vehicle_id} onChange={e=>setNewBooking({...newBooking, vehicle_id: e.target.value})}>
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Select Service</label>
            <select className="input-field" required value={newBooking.service_id} onChange={e=>setNewBooking({...newBooking, service_id: e.target.value})}>
              <option value="">-- Choose Service --</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name} - INR {s.price}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} type="submit">Book Appointment</button>
        </form>
      </div>

      <div className="glass-panel">
        <h3>My Service History</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Vehicle</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No history found.</td></tr>
              ) : bookings.map(b => (
              <tr key={b.id}>
                <td>{b.vehicle_make} {b.vehicle_model}</td>
                <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem',
                    color: b.status === 'completed' ? '#34d399' : (b.status === 'in_progress' ? '#60a5fa' : '#fcd34d')
                  }}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
