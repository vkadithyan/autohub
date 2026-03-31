import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle } from 'lucide-react';

export default function AssignedWork() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetchAssignedWork();
  }, []);

  const fetchAssignedWork = async () => {
    try {
      const res = await api.get(`/bookings?mechanic_id=${user.id}`);
      setWorks(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      fetchAssignedWork();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="glass-panel">
      <h3>My Job Queue</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date Assigned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {works.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No jobs assigned yet.</td></tr>
            ) : works.map(w => (
              <tr key={w.id}>
                <td>#{w.id}</td>
                <td>{w.customer_name}</td>
                <td>{w.vehicle_make} {w.vehicle_model}</td>
                <td>{new Date(w.booking_date).toLocaleDateString()}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', 
                    background: w.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                    color: w.status === 'completed' ? '#34d399' : '#60a5fa' 
                  }}>
                    {w.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  {w.status !== 'completed' ? (
                    <button 
                      className="btn" 
                      style={{ background: 'var(--success-color)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleUpdateStatus(w.id, 'completed')}
                    >
                      <CheckCircle size={14} /> Commit Fix
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Finished</span>
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
