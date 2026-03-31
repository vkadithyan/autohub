import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchMechanics = async () => {
    try {
      const res = await api.get('/mechanics');
      setMechanics(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAssign = async (bookingId, mechanicId) => {
    if (!mechanicId) return;
    try {
      await api.put(`/bookings/${bookingId}/assign`, { mechanic_id: mechanicId });
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert('Failed to assign mechanic.');
    }
  };

  return (
    <div className="glass-panel">
      <h3>Manage Bookings & Assignments</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Status</th>
              <th>Assigned Mechanic</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bookings found.</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.customer_name}</td>
                <td>{b.vehicle_make} {b.vehicle_model}</td>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', 
                    background: b.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: b.status === 'completed' ? '#34d399' : '#fcd34d' 
                  }}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  {b.status === 'completed' ? (
                     <span>{b.mechanic_name || 'Done'}</span>
                  ) : (
                    <select 
                      className="input-field" 
                      style={{ padding: '0.25rem', fontSize: '0.85rem' }}
                      value={b.mechanic_id || ''}
                      onChange={(e) => handleAssign(b.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {mechanics.filter(m => m.status === 'available').map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
