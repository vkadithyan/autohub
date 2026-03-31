import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Phone, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing-page">
      <nav className="navbar" style={{ position: 'relative' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--text-primary)' }}>
            <Car style={{ color: 'var(--accent-color)' }} /> AutoHub
          </h1>
        </Link>
        <div className="nav-links">
          <Link to="/login" className="btn" style={{ background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary">Register Now</Link>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            <span className="text-gradient">Premium Vehicle Care</span><br /><span style={{ color: 'var(--text-primary)' }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            Book trusted mechanics, monitor your service history, and experience a fully digital auto shop process from end-to-end.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Your Journey <ArrowRight size={20} />
          </Link>
        </div>
      </header>
    </div>
  );
}
