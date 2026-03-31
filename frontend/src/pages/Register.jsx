import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', username: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <UserPlus size={28} style={{ color: 'var(--accent-color)' }} /> Join AutoHub
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create your new account</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{success}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Phone Number</label>
              <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Username</label>
              <input type="text" className="input-field" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Password</label>
              <input type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label>Register As</label>
            <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="customer">Customer</option>
              <option value="mechanic">Mechanic</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>Sign in instead</Link>
        </p>
      </div>
    </div>
  );
}
