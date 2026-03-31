import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, CalendarCheck, Users, Wrench, Car } from 'lucide-react';

export default function DashboardLayout({ rolename }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getSidebarLinks = () => {
    switch (rolename) {
      case 'admin':
        return [
          { to: '/admin/bookings', label: 'Job Manager', icon: <CalendarCheck size={18} /> },
          { to: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
          { to: '/admin/mechanics', label: 'Mechanics', icon: <Wrench size={18} /> }
        ];
      case 'customer':
        return [
          { to: '/customer/vehicles', label: 'My Vehicles', icon: <Car size={18} /> },
          { to: '/customer/bookings', label: 'Book Service', icon: <CalendarCheck size={18} /> }
        ];
      case 'mechanic':
        return [
          { to: '/mechanic/assigned-work', label: 'Assigned Work', icon: <Wrench size={18} /> }
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AutoHub <span className="role-badge">{rolename}</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/" className="sidebar-link" style={{ marginTop: 'auto', opacity: 0.7 }}>
            <Home size={18} /> Frontpage
          </Link>
        </nav>
      </aside>

      {/* Main Content Payload */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {links.find(l => l.to === location.pathname)?.label || 'Dashboard'}
            </h3>
          </div>
          <div className="topbar-right">
            <span>Welcome, {user?.username}</span>
            <button className="btn btn-logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        
        <div className="payload-area animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
